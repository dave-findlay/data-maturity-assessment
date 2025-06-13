export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  // Simple in-memory rate limiting (use Redis in production)
  if (!global.rateLimiter) {
    global.rateLimiter = new Map();
  }

  if (global.rateLimiter.has(clientIP)) {
    const requests = global.rateLimiter.get(clientIP);
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    global.rateLimiter.set(clientIP, [...recentRequests, now]);
  } else {
    global.rateLimiter.set(clientIP, [now]);
  }

  try {
    const { userProfile, scores, maturityTier } = req.body;
    
    if (!userProfile || !scores || !maturityTier) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Get OpenAI API key from server environment (secure)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ 
        error: 'Analysis service is currently unavailable. Please contact support for assistance.',
        retryable: false
      });
    }

    // Input validation and sanitization
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return '';
      return str.trim().substring(0, 1000); // Limit length
    };

    const sanitizedProfile = {
      companySize: sanitizeString(userProfile.companySize),
      industry: sanitizeString(userProfile.industry || 'Technology'),
      jobTitle: sanitizeString(userProfile.jobTitle),
      companyName: sanitizeString(userProfile.companyName)
    };

    // System message for function calling
    const systemMessage = `You are a senior data strategy consultant specializing in DAMA frameworks and organizational data maturity assessments. Provide executive-level analysis using DAMA knowledge areas.

## Analysis Guidelines:
- Ground recommendations in DAMA frameworks (Governance, Architecture, Modeling, Storage, Security, Integration, Content, Master Data, BI, Metadata, Quality)
- Consider organizational context (${sanitizedProfile.companySize} company, ${sanitizedProfile.jobTitle} perspective)
- Provide specific next steps with realistic timelines
- Include both quick wins and strategic initiatives
- Address compliance and regulatory considerations for ${sanitizedProfile.industry} industry
- Include industry-specific insights for ${sanitizedProfile.industry} sector
- Reference current data trends (AI/ML, cloud-native, data mesh, etc.)
- Focus on practical implementation guidance
- Keep content professional but accessible

You will be asked to call a function to provide your analysis in a structured format.`;

    // User message with assessment data
    const userMessage = `Analyze this data maturity assessment and generate a comprehensive diagnostic report:

## Assessment Data:
- Company: ${sanitizedProfile.companySize} employees, ${sanitizedProfile.industry} industry
- Role: ${sanitizedProfile.jobTitle}
- Maturity Level: ${maturityTier.name} (${scores.overall.toFixed(1)}/5.0)
- Dimension Scores:
  • Strategy & Alignment: ${scores.dimensions.strategy?.toFixed(1) || 'N/A'}/5.0
  • Governance: ${scores.dimensions.governance?.toFixed(1) || 'N/A'}/5.0  
  • Architecture & Integration: ${scores.dimensions.architecture?.toFixed(1) || 'N/A'}/5.0
  • Analytics & Decision Enablement: ${scores.dimensions.analytics?.toFixed(1) || 'N/A'}/5.0
  • Team & Skills: ${scores.dimensions.team?.toFixed(1) || 'N/A'}/5.0
  • Data Quality & Operations: ${scores.dimensions.quality?.toFixed(1) || 'N/A'}/5.0
  • Metadata & Documentation: ${scores.dimensions.metadata?.toFixed(1) || 'N/A'}/5.0
  • Security & Risk Management: ${scores.dimensions.security?.toFixed(1) || 'N/A'}/5.0

## Requirements:
- Ground analysis in DAMA's 11 Knowledge Areas (Governance, Architecture, Modeling, Storage, Security, Integration, Content, Master Data, BI, Metadata, Quality)
- Reference ${sanitizedProfile.industry} industry specifics and modern trends (AI/ML, cloud-native, data mesh)
- Use specific, actionable language with concrete DAMA practices
- Apply agile data strategy principles (iterative, value-driven, cross-functional)
- Provide 3-5 items for each SWOT category
- Include 3-4 strategic recommendations with clear titles and detailed content
- Provide 3 implementation phases (0-3 months, 3-6 months, 6+ months) with specific actions

Please call the function to provide your structured analysis.`;

    // OpenAI API payload with function calling
    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      tools: [{
        type: "function",
        function: {
          name: "provide_data_maturity_analysis",
          description: "Provide comprehensive data maturity analysis with structured output",
          parameters: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "Executive summary of the data maturity assessment"
              },
              peerComparison: {
                type: "string",
                description: "Comparison with industry peers and benchmarks"
              },
              swot: {
                type: "object",
                properties: {
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of organizational data strengths"
                  },
                  weaknesses: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of data-related weaknesses to address"
                  },
                  opportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of opportunities for data improvement"
                  },
                  threats: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of potential threats or risks"
                  }
                },
                required: ["strengths", "weaknesses", "opportunities", "threats"]
              },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Title of the recommendation"
                    },
                    content: {
                      type: "string",
                      description: "Detailed content of the recommendation"
                    }
                  },
                  required: ["title", "content"]
                },
                description: "List of strategic recommendations"
              },
              nextSteps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Title of the next step or phase"
                    },
                    content: {
                      type: "string",
                      description: "Detailed description of the next step"
                    }
                  },
                  required: ["title", "content"]
                },
                description: "List of recommended next steps or implementation phases"
              }
            },
            required: ["summary", "peerComparison", "swot", "recommendations", "nextSteps"]
          }
        }
      }],
      tool_choice: {
        type: "function",
        function: { name: "provide_data_maturity_analysis" }
      },
      max_tokens: 2000,
      temperature: 0.7
    };

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      return res.status(500).json({ 
        error: 'Analysis service temporarily unavailable. Please try again in a moment.',
        retryable: true
      });
    }

    const data = await response.json();
    
    // Extract function call response
    const message = data.choices[0].message;
    
    if (!message.tool_calls || !message.tool_calls[0] || !message.tool_calls[0].function) {
      console.error('OpenAI did not return a function call response');
      return res.status(500).json({ 
        error: 'Analysis service returned unexpected format. Please try again.',
        retryable: true
      });
    }
    
    const functionCall = message.tool_calls[0].function;
    const analysisText = functionCall.arguments;
    
    // Parse the function arguments (guaranteed to be valid JSON by OpenAI)
    const analysis = JSON.parse(analysisText);
    
    // Structure the response
    const result = {
      summary: analysis.summary || 'Analysis summary not available.',
      improvements: [], // Legacy field - keeping for backward compatibility
      recommendations: analysis.recommendations || [],
      peerComparison: analysis.peerComparison || 'Peer comparison not available.',
      nextSteps: analysis.nextSteps || [],
      swot: {
        strengths: analysis.swot?.strengths || [],
        weaknesses: analysis.swot?.weaknesses || [],
        opportunities: analysis.swot?.opportunities || [],
        threats: analysis.swot?.threats || []
      }
    };
    
    res.status(200).json({ success: true, analysis: result });

  } catch (error) {
    console.error('Error in generate-analysis:', error);
    
    // Log error to blob storage for debugging
    try {
      const errorId = 'ERR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const errorData = {
        id: errorId,
        type: 'ANALYSIS_GENERATION_ERROR',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        companyName: req.body?.userProfile?.companyName
      };

      // Save error log
      await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/log-error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      });

      return res.status(500).json({ 
        error: 'Unable to process analysis request. Please try again in a moment.',
        retryable: true,
        errorId: errorId
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
      return res.status(500).json({ 
        error: 'Analysis service temporarily unavailable. Please try again later.',
        retryable: true
      });
    }
  }
} 