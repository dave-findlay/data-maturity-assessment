// API service for backend integration
// This file provides examples for integrating with various backend services

// Example: Airtable Integration
export const submitToAirtable = async (data) => {
  const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = 'Assessments';

  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Full Name': data.userProfile.fullName,
          'Email': data.userProfile.email,
          'Job Title': data.userProfile.jobTitle,
          'Company Name': data.userProfile.companyName,
          'Company Size': data.userProfile.companySize,
          'Industry': data.userProfile.industry,
          'Overall Score': data.results.scores.overall,
          'Maturity Tier': data.results.maturityTier.name,
          'Strategy Score': data.results.scores.dimensions.strategy,
          'Governance Score': data.results.scores.dimensions.governance,
          'Architecture Score': data.results.scores.dimensions.architecture,
          'Analytics Score': data.results.scores.dimensions.analytics,
          'Team Score': data.results.scores.dimensions.team,
          'Quality Score': data.results.scores.dimensions.quality,
          'Metadata Score': data.results.scores.dimensions.metadata,
          'Security Score': data.results.scores.dimensions.security,
          'Analysis Summary': data.results.analysis.summary,
          'Submitted At': new Date().toISOString(),
          'Consent to Follow Up': data.consent || false
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Airtable');
    }

    return await response.json();
  } catch (error) {
    console.error('Airtable submission error:', error);
    throw error;
  }
};

// Example: Supabase Integration
export const submitToSupabase = async (data) => {
  const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/assessments`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        full_name: data.userProfile.fullName,
        email: data.userProfile.email,
        job_title: data.userProfile.jobTitle,
        company_name: data.userProfile.companyName,
        company_size: data.userProfile.companySize,
        industry: data.userProfile.industry,
        overall_score: data.results.scores.overall,
        maturity_tier: data.results.maturityTier.name,
        dimension_scores: data.results.scores.dimensions,
        analysis: data.results.analysis,
        submitted_at: new Date().toISOString(),
        consent_to_follow_up: data.consent || false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Supabase');
    }

    return response.status === 201 ? { success: true } : await response.json();
  } catch (error) {
    console.error('Supabase submission error:', error);
    throw error;
  }
};

// Example: Slack Webhook Notification
export const sendSlackNotification = async (data) => {
  const SLACK_WEBHOOK_URL = process.env.REACT_APP_SLACK_WEBHOOK_URL;

  if (!SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not configured');
    return;
  }

  const message = {
    text: "🎯 New Data Maturity Assessment Completed!",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎯 New Data Maturity Assessment"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Name:* ${data.userProfile.fullName}`
          },
          {
            type: "mrkdwn",
            text: `*Company:* ${data.userProfile.companyName}`
          },
          {
            type: "mrkdwn",
            text: `*Job Title:* ${data.userProfile.jobTitle}`
          },
          {
            type: "mrkdwn",
            text: `*Company Size:* ${data.userProfile.companySize}`
          },
          {
            type: "mrkdwn",
            text: `*Email:* ${data.userProfile.email || 'Not provided'}`
          },
          {
            type: "mrkdwn",
            text: `*Industry:* ${data.userProfile.industry || 'Not specified'}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Overall Score:* ${data.results.scores.overall.toFixed(1)}/5.0`
          },
          {
            type: "mrkdwn",
            text: `*Maturity Tier:* ${data.results.maturityTier.name}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Report Requested:* ${data.reportRequested ? '✅ Yes' : '❌ No'}`
        }
      }
    ]
  };

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error('Failed to send Slack notification');
    }

    return { success: true };
  } catch (error) {
    console.error('Slack notification error:', error);
    throw error;
  }
};

// Example: Email Notification (using a generic webhook)
export const sendEmailNotification = async (data) => {
  const EMAIL_WEBHOOK_URL = process.env.REACT_APP_EMAIL_WEBHOOK_URL;

  if (!EMAIL_WEBHOOK_URL) {
    console.warn('Email webhook URL not configured');
    return;
  }

  const emailData = {
    to: process.env.REACT_APP_ADMIN_EMAIL || 'admin@yourcompany.com',
    subject: `New Data Maturity Assessment: ${data.userProfile.companyName}`,
    html: `
      <h2>New Data Maturity Assessment Completed</h2>
      <p><strong>Participant:</strong> ${data.userProfile.fullName}</p>
      <p><strong>Company:</strong> ${data.userProfile.companyName}</p>
      <p><strong>Job Title:</strong> ${data.userProfile.jobTitle}</p>
      <p><strong>Company Size:</strong> ${data.userProfile.companySize}</p>
      <p><strong>Email:</strong> ${data.userProfile.email || 'Not provided'}</p>
      <p><strong>Industry:</strong> ${data.userProfile.industry || 'Not specified'}</p>
      
      <h3>Results Summary</h3>
      <p><strong>Overall Score:</strong> ${data.results.scores.overall.toFixed(1)}/5.0</p>
      <p><strong>Maturity Tier:</strong> ${data.results.maturityTier.name}</p>
      <p><strong>Report Requested:</strong> ${data.reportRequested ? 'Yes' : 'No'}</p>
      
      <h3>Dimension Scores</h3>
      <ul>
        <li>Strategy & Alignment: ${data.results.scores.dimensions.strategy?.toFixed(1) || 'N/A'}</li>
        <li>Data Governance: ${data.results.scores.dimensions.governance?.toFixed(1) || 'N/A'}</li>
        <li>Architecture & Integration: ${data.results.scores.dimensions.architecture?.toFixed(1) || 'N/A'}</li>
        <li>Analytics & Decision Enablement: ${data.results.scores.dimensions.analytics?.toFixed(1) || 'N/A'}</li>
        <li>Team & Skills: ${data.results.scores.dimensions.team?.toFixed(1) || 'N/A'}</li>
        <li>Data Quality & Operations: ${data.results.scores.dimensions.quality?.toFixed(1) || 'N/A'}</li>
        <li>Metadata & Documentation: ${data.results.scores.dimensions.metadata?.toFixed(1) || 'N/A'}</li>
        <li>Security & Risk Management: ${data.results.scores.dimensions.security?.toFixed(1) || 'N/A'}</li>
      </ul>
    `
  };

  try {
    const response = await fetch(EMAIL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error('Failed to send email notification');
    }

    return { success: true };
  } catch (error) {
    console.error('Email notification error:', error);
    throw error;
  }
};

// Main submission function that handles all integrations
export const submitAssessment = async (assessmentData) => {
  const results = [];

  try {
    // Submit to primary data store (choose one)
    if (process.env.REACT_APP_AIRTABLE_API_KEY) {
      const airtableResult = await submitToAirtable(assessmentData);
      results.push({ service: 'airtable', success: true, data: airtableResult });
    } else if (process.env.REACT_APP_SUPABASE_URL) {
      const supabaseResult = await submitToSupabase(assessmentData);
      results.push({ service: 'supabase', success: true, data: supabaseResult });
    }

    // Send notifications (these can run in parallel)
    const notifications = [];
    
    if (process.env.REACT_APP_SLACK_WEBHOOK_URL) {
      notifications.push(
        sendSlackNotification(assessmentData)
          .then(() => ({ service: 'slack', success: true }))
          .catch(error => ({ service: 'slack', success: false, error: error.message }))
      );
    }

    if (process.env.REACT_APP_EMAIL_WEBHOOK_URL) {
      notifications.push(
        sendEmailNotification(assessmentData)
          .then(() => ({ service: 'email', success: true }))
          .catch(error => ({ service: 'email', success: false, error: error.message }))
      );
    }

    // Wait for all notifications to complete
    const notificationResults = await Promise.all(notifications);
    results.push(...notificationResults);

    return {
      success: true,
      results: results
    };

  } catch (error) {
    console.error('Assessment submission error:', error);
    return {
      success: false,
      error: error.message,
      results: results
    };
  }
};

// Helper function to log errors to blob storage for debugging
const logErrorToBlob = async (errorData) => {
  try {
    const errorId = generateErrorId();
    const timestamp = new Date().toISOString();
    
    const errorLog = {
      id: errorId,
      timestamp,
      ...errorData
    };

    // Save to blob storage
    const response = await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorLog)
    });

    if (response.ok) {
      console.log(`🐛 Error logged to blob storage: ${errorId}`);
      return errorId;
    } else {
      console.warn('Failed to log error to blob storage');
      return null;
    }
  } catch (logError) {
    console.warn('Error logging failed:', logError);
    return null;
  }
};

// Generate a short error ID for tracking
function generateErrorId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ERR-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// LLM Integration Example (OpenAI)
// Updated to use environment variable from Vercel
// Triggering redeploy to pick up corrected API key
export const generateLLMAnalysis = async (userProfile, scores, maturityTier) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('Analysis service is currently unavailable. Please contact support for assistance.');
  }

  // Optimized system message - concise role definition with explicit JSON formatting requirement
  const systemMessage = `You are a senior data strategy consultant specializing in DAMA frameworks and organizational data maturity assessments. Provide executive-level analysis using DAMA knowledge areas. 

CRITICAL FORMATTING REQUIREMENT: Your response must be ONLY valid JSON. Do not wrap your response in markdown code blocks or include any text outside the JSON object. Start your response directly with { and end with }. No \`\`\`json prefix or \`\`\` suffix.`;

  // Optimized user message - focused on the specific task and data
  const userMessage = `Analyze this data maturity assessment and generate a comprehensive diagnostic report:

## Assessment Data:
- Company: ${userProfile.companySize} employees, ${userProfile.industry || 'Technology'} industry
- Role: ${userProfile.jobTitle}
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
- Reference ${userProfile.industry || 'technology'} industry specifics and modern trends (AI/ML, cloud-native, data mesh)
- Use specific, actionable language with concrete DAMA practices
- Apply agile data strategy principles (iterative, value-driven, cross-functional)

## Response Format (JSON only):
{
  "summary": "Comprehensive maturity analysis with DAMA knowledge areas and industry context",
  "peerComparison": "Industry benchmark comparison highlighting 2-3 standout areas with DAMA terminology", 
  "swot": {
    "strengths": ["strength with DAMA reference", "strength with DAMA reference"],
    "weaknesses": ["weakness with DAMA reference", "weakness with DAMA reference"],
    "opportunities": ["opportunity with DAMA reference", "opportunity with DAMA reference"], 
    "threats": ["threat with DAMA reference", "threat with DAMA reference"]
  },
  "recommendations": [
    {"title": "Priority 1", "content": "Specific actionable recommendation"},
    {"title": "Priority 2", "content": "Specific actionable recommendation"},
    {"title": "Priority 3", "content": "Specific actionable recommendation"}
  ],
  "nextSteps": [
    {"title": "Phase 1 (0-3 months)", "content": "Immediate actions"},
    {"title": "Phase 2 (3-6 months)", "content": "Medium-term initiatives"}, 
    {"title": "Phase 3 (6+ months)", "content": "Long-term transformation"}
  ]
}`;

  // Create the payload that will be sent to OpenAI
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
    max_tokens: 1200,
    temperature: 0.7
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;

  try {
    // Clean the response text by removing markdown code block formatting
    let cleanedText = analysisText.trim();
    
    // Remove ```json at the beginning
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '');
    }
    
    // Remove ``` at the end
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.replace(/\s*```$/, '');
    }
    
    // Additional JSON cleaning - fix common malformed JSON issues
    // Fix missing closing brackets in arrays
    cleanedText = cleanedText.replace(/\]\s*"[a-zA-Z]/g, (match) => {
      return match.replace(']', '],');
    });
    
    // Fix missing commas between objects
    cleanedText = cleanedText.replace(/}\s*"[a-zA-Z]/g, (match) => {
      return match.replace('}', '},');
    });
    
    // Try to validate and fix the JSON structure
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn('First JSON parse attempt failed, trying to fix structure...');
      
      // If parsing fails, try more aggressive fixes
      // This is a fallback for badly malformed JSON
      try {
        // Find the last valid closing brace and truncate there
        const lastBraceIndex = cleanedText.lastIndexOf('}');
        if (lastBraceIndex > 0) {
          cleanedText = cleanedText.substring(0, lastBraceIndex + 1);
          analysis = JSON.parse(cleanedText);
        } else {
          throw parseError; // Re-throw original error if we can't fix it
        }
      } catch (secondError) {
        console.error('Failed to parse JSON even after cleanup attempts');
        throw parseError; // Use original error for better debugging
      }
    }
    
    const result = {
      summary: analysis.summary,
      improvements: [], // Legacy field - keeping for backward compatibility
      recommendations: analysis.recommendations, // Now an array of objects
      peerComparison: analysis.peerComparison,
      nextSteps: analysis.nextSteps, // Now an array of objects
      swot: analysis.swot, // New structured SWOT data
      // Add debug information
      _debug: {
        payload: payload,
        rawResponse: analysisText,
        cleanedResponse: cleanedText,
        timestamp: new Date().toISOString()
      }
    };
    
    return result;
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', error);
    console.log('Raw response:', analysisText);
    
    // Initialize cleanedText with a fallback value if not defined
    const cleanedText = analysisText.trim();
    
    // Log the error to blob storage for debugging
    const errorId = await logErrorToBlob({
      type: 'JSON_PARSE_ERROR',
      error: error.message,
      stack: error.stack,
      rawResponse: analysisText,
      cleanedResponse: cleanedText,
      payload: payload,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    // Throw a user-friendly error with retry instructions
    const userError = new Error(`Unable to process analysis results. This appears to be a temporary issue with our AI service. Please try again in a moment.${errorId ? ` (Error ID: ${errorId} for support)` : ''}`);
    userError.retryable = true;
    userError.errorId = errorId;
    throw userError;
  }
};

// Helper function to parse LLM response into structured sections
// eslint-disable-next-line no-unused-vars
const parseLLMResponse = (analysis) => {
  console.log('🔍 Parsing LLM response:', analysis);
  
  // Split the response into lines for parsing
  const lines = analysis.split('\n').filter(line => line.trim());
  
  let summary = '';
  let improvements = [];
  let recommendations = [];
  let peerComparison = '';
  let nextSteps = [];
  let swotData = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };
  
  let currentSection = '';
  let currentSwotElement = '';
  let tempContent = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detect section headers based on the new structured format
    if (trimmedLine.includes('1.') && trimmedLine.toLowerCase().includes('summary')) {
      if (tempContent.length > 0) processCurrentSection();
      currentSection = 'summary';
      continue;
    } else if (trimmedLine.includes('2.') && trimmedLine.toLowerCase().includes('peer')) {
      if (tempContent.length > 0) processCurrentSection();
      currentSection = 'peerComparison';
      continue;
    } else if (trimmedLine.includes('3.') && trimmedLine.toLowerCase().includes('swot')) {
      if (tempContent.length > 0) processCurrentSection();
      currentSection = 'swot';
      continue;
    } else if (trimmedLine.includes('4.') && (trimmedLine.toLowerCase().includes('strategic') || trimmedLine.toLowerCase().includes('recommendation'))) {
      if (tempContent.length > 0) processCurrentSection();
      currentSection = 'recommendations';
      continue;
    } else if (trimmedLine.includes('5.') && (trimmedLine.toLowerCase().includes('next steps') || trimmedLine.toLowerCase().includes('roadmap'))) {
      if (tempContent.length > 0) processCurrentSection();
      currentSection = 'nextSteps';
      continue;
    } else if (trimmedLine.includes('6.') && (trimmedLine.toLowerCase().includes('call') || trimmedLine.toLowerCase().includes('action'))) {
      if (tempContent.length > 0) processCurrentSection();
      currentSection = 'callToAction';
      continue;
    }
    
    // Detect SWOT sub-elements
    if (currentSection === 'swot') {
      if (trimmedLine.toLowerCase().includes('**strengths**') || trimmedLine.toLowerCase().startsWith('strengths')) {
        if (tempContent.length > 0 && currentSwotElement) processSWOTElement();
        currentSwotElement = 'strengths';
        continue;
      } else if (trimmedLine.toLowerCase().includes('**weaknesses**') || trimmedLine.toLowerCase().startsWith('weaknesses')) {
        if (tempContent.length > 0 && currentSwotElement) processSWOTElement();
        currentSwotElement = 'weaknesses';
        continue;
      } else if (trimmedLine.toLowerCase().includes('**opportunities**') || trimmedLine.toLowerCase().startsWith('opportunities')) {
        if (tempContent.length > 0 && currentSwotElement) processSWOTElement();
        currentSwotElement = 'opportunities';
        continue;
      } else if (trimmedLine.toLowerCase().includes('**threats**') || trimmedLine.toLowerCase().startsWith('threats')) {
        if (tempContent.length > 0 && currentSwotElement) processSWOTElement();
        currentSwotElement = 'threats';
        continue;
      }
    }
    
    // Skip section dividers and empty lines
    if (trimmedLine === '---' || trimmedLine.startsWith('###') || trimmedLine.length < 3) {
      continue;
    }
    
    // Add content to current section
    if (trimmedLine && !trimmedLine.match(/^\*\*\d+\./) && !trimmedLine.match(/^\*\*[A-Z]/)) {
      tempContent.push(trimmedLine);
    }
  }
  
  // Process remaining content
  if (tempContent.length > 0) {
    if (currentSection === 'swot' && currentSwotElement) {
      processSWOTElement();
    } else {
      processCurrentSection();
    }
  }
  
  function processCurrentSection() {
    const content = tempContent.join(' ').trim();
    switch (currentSection) {
      case 'summary':
        summary = content;
        break;
      case 'peerComparison':
        peerComparison = content;
        break;
      case 'recommendations':
        // Try to parse as numbered list and convert to structured format
        const recItems = parseTextToStructuredItems(content, 'Recommendation');
        recommendations = recItems.length > 0 ? recItems : [{ title: 'Strategic Recommendations', content: content }];
        break;
      case 'nextSteps':
        // Try to parse as phases and convert to structured format
        const stepItems = parseTextToStructuredItems(content, 'Phase');
        nextSteps = stepItems.length > 0 ? stepItems : [{ title: 'Next Steps', content: content }];
        break;
      case 'callToAction':
        // Add call-to-action to recommendations if no separate recommendations exist
        if (recommendations.length === 0) {
          recommendations = [{ title: 'Call to Action', content: content }];
        }
        break;
      default:
        // Handle any unexpected section
        console.log('Unexpected section:', currentSection, content);
        break;
    }
    tempContent = [];
  }
  
  function processSWOTElement() {
    const items = extractListItems(tempContent.join('\n'));
    if (items.length > 0) {
      swotData[currentSwotElement] = items;
    }
    tempContent = [];
  }
  
  // Helper function to parse text into structured items
  function parseTextToStructuredItems(text, defaultPrefix) {
    const items = [];
    
    // Try to match numbered items with bold titles: "1. **Title**: Content"
    const numberedWithTitles = text.match(/\d+\.\s*\*\*([^*]+)\*\*:\s*([^1-9]+?)(?=\d+\.\s*\*\*|$)/gs);
    
    if (numberedWithTitles && numberedWithTitles.length > 0) {
      numberedWithTitles.forEach(item => {
        const match = item.match(/\d+\.\s*\*\*([^*]+)\*\*:\s*(.+)/s);
        if (match) {
          items.push({
            title: match[1].trim(),
            content: match[2].trim()
          });
        }
      });
    } else {
      // Try to match phase patterns for next steps
      const phaseMatches = text.match(/Phase\s+(\d+)\s*\([^)]+\):\s*([^P]+?)(?=Phase\s+\d+|$)/gs);
      
      if (phaseMatches && phaseMatches.length > 0) {
        phaseMatches.forEach(phase => {
          const match = phase.match(/Phase\s+(\d+)\s*\(([^)]+)\):\s*(.+)/s);
          if (match) {
            items.push({
              title: `Phase ${match[1]} (${match[2]})`,
              content: match[3].trim()
            });
          }
        });
      } else {
        // Fallback: try simple numbered items
        const numberedItems = text.match(/\d+\.\s*([^1-9]+?)(?=\d+\.|$)/gs);
        
        if (numberedItems && numberedItems.length > 0) {
          numberedItems.forEach((item, index) => {
            const content = item.replace(/^\d+\.\s*/, '').trim();
            if (content) {
              items.push({
                title: `${defaultPrefix} ${index + 1}`,
                content: content
              });
            }
          });
        }
      }
    }
    
    return items;
  }
  
  // Convert SWOT data to improvements array for compatibility
  improvements = [
    ...swotData.strengths.map(item => `💪 Strength: ${item}`),
    ...swotData.weaknesses.map(item => `⚠️ Weakness: ${item}`),
    ...swotData.opportunities.map(item => `🚀 Opportunity: ${item}`),
    ...swotData.threats.map(item => `⚡ Threat: ${item}`)
  ];
  
  console.log('📊 Parsed sections:', { summary, improvements, recommendations, peerComparison, nextSteps, swotData });
  
  return {
    summary,
    improvements,
    recommendations, // Now returns structured array
    peerComparison,
    nextSteps // Now returns structured array
  };
};

// Helper function to extract list items from text
const extractListItems = (text) => {
  const items = [];
  
  // Look for bullet points, numbers, or dashes
  const bulletRegex = /(?:^|\n)(?:[-•*]|\d+\.)\s*(.+?)(?=\n(?:[-•*]|\d+\.)|$)/gs;
  let match;
  
  while ((match = bulletRegex.exec(text)) !== null) {
    const item = match[1].trim();
    if (item.length > 10) { // Only include substantial items
      items.push(item);
    }
  }
  
  // If no bullet points found, try to split by sentences and take key ones
  if (items.length === 0) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim());
  }
  
  return items.slice(0, 4); // Limit to 4 items max
}; 