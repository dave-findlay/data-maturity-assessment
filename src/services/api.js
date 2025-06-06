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

// LLM Integration Example (OpenAI)
export const generateLLMAnalysis = async (userProfile, scores, maturityTier) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.warn('⚠️ OpenAI API key not found, using mock analysis for demo purposes');
    return generateMockAnalysis(userProfile, scores, maturityTier);
  }

  const prompt = `
You are an experienced data strategy advisor with deep expertise in DAMA (Data Management Association) frameworks, DMBOK best practices, and agile data strategy methodologies.

A user has just completed a data maturity self-assessment. Based on their responses and business context, generate a creative, specific, executive-level diagnostic report grounded in DAMA knowledge areas and agile data strategy principles.

IMPORTANT: Ground all analysis and recommendations in the 11 DAMA Knowledge Areas:
1. Data Governance
2. Data Architecture
3. Data Modeling & Design
4. Data Storage & Operations
5. Data Security
6. Data Integration & Interoperability
7. Documents & Content Management
8. Reference & Master Data Management
9. Data Warehousing & Business Intelligence
10. Metadata Management
11. Data Quality

CREATIVITY GUIDELINES:
- Use specific, actionable language rather than generic advice
- Reference industry-specific challenges and opportunities for ${userProfile.industry || 'their sector'}
- Incorporate modern data trends (AI/ML, cloud-native, data mesh, etc.) where relevant
- Apply agile data strategy principles (iterative, value-driven, cross-functional)
- Provide concrete examples and specific DAMA practices

### Input Data:
- Company Size: ${userProfile.companySize}  
- Job Title: ${userProfile.jobTitle}  
- Industry: ${userProfile.industry || 'Not specified'}  
- Maturity Tier: ${maturityTier.name}  
- Average Score: ${scores.overall.toFixed(1)}  
- Dimension Scores:  
  - Strategy & Alignment: ${scores.dimensions.strategy?.toFixed(1) || 'N/A'}  
  - Governance: ${scores.dimensions.governance?.toFixed(1) || 'N/A'}  
  - Architecture & Integration: ${scores.dimensions.architecture?.toFixed(1) || 'N/A'}  
  - Analytics & Decision Enablement: ${scores.dimensions.analytics?.toFixed(1) || 'N/A'}  
  - Team & Skills: ${scores.dimensions.team?.toFixed(1) || 'N/A'}  
  - Data Quality & Ops: ${scores.dimensions.quality?.toFixed(1) || 'N/A'}  
  - Metadata & Documentation: ${scores.dimensions.metadata?.toFixed(1) || 'N/A'}  
  - Security & Risk: ${scores.dimensions.security?.toFixed(1) || 'N/A'}

RESPOND ONLY WITH VALID JSON in the following exact structure (no additional text, markdown, or formatting):

{
  "summary": "A comprehensive summary of the organization's overall data maturity, describing their tier and what it means in terms of data capability. Reference relevant DAMA knowledge areas and industry-specific context.",
  "peerComparison": "Comparison with other organizations of similar size and industry, highlighting 2-3 standout areas using specific DAMA terminology and industry benchmarks.",
  "swot": {
    "strengths": [
      "First strength with specific DAMA reference",
      "Second strength with specific DAMA reference"
    ],
    "weaknesses": [
      "First weakness with specific DAMA reference", 
      "Second weakness with specific DAMA reference"
    ],
    "opportunities": [
      "First opportunity with specific DAMA reference",
      "Second opportunity with specific DAMA reference"
    ],
    "threats": [
      "First threat with specific DAMA reference",
      "Second threat with specific DAMA reference"
    ]
  },
  "recommendations": [
    {
      "title": "Augment Data Governance",
      "content": "Establish a cross-functional team encompassing all data stakeholders. Initiate a DAMA-aligned governance framework to standardize data handling across the organization."
    },
    {
      "title": "Improve Data Quality",
      "content": "Implement systems for continuous data monitoring and cleansing. Leverage your team's skillset to automate these processes where possible."
    },
    {
      "title": "Devise a Comprehensive Data Strategy",
      "content": "Align data initiatives with business goals. Prioritize initiatives based on their potential for immediate value and iteratively expand upon successes."
    }
  ],
  "nextSteps": [
    {
      "title": "Phase 1 (0-3 months)",
      "content": "Establish data governance council, conduct data inventory assessment, implement basic data quality monitoring tools, and define data ownership roles across key business areas."
    },
    {
      "title": "Phase 2 (3-6 months)", 
      "content": "Deploy automated data quality processes, establish master data management practices, implement metadata cataloging system, and begin advanced analytics pilot projects."
    },
    {
      "title": "Phase 3 (6+ months)",
      "content": "Scale successful pilot programs, implement enterprise-wide data architecture, establish self-service analytics capabilities, and develop predictive analytics competencies."
    }
  ]
}

Respond in a creative, specific tone as if advising a senior data leader. Use concrete examples, specific DAMA practices, and industry-relevant insights. Avoid generic recommendations.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a data strategy consultant providing professional assessments of organizational data maturity. Always respond with valid JSON only, no additional text or formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;

  try {
    // Parse the JSON response directly
    const analysis = JSON.parse(analysisText);
    
    return {
      summary: analysis.summary,
      improvements: [], // Legacy field - keeping for backward compatibility
      recommendations: analysis.recommendations, // Now an array of objects
      peerComparison: analysis.peerComparison,
      nextSteps: analysis.nextSteps, // Now an array of objects
      swot: analysis.swot // New structured SWOT data
    };
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', error);
    console.log('Raw response:', analysisText);
    
    // Fallback to text parsing if JSON parsing fails
    const parsedAnalysis = parseLLMResponse(analysisText);
    return {
      summary: parsedAnalysis.summary,
      improvements: parsedAnalysis.improvements,
      recommendations: parsedAnalysis.recommendations,
      peerComparison: parsedAnalysis.peerComparison,
      nextSteps: parsedAnalysis.nextSteps
    };
  }
};

// Helper function to parse LLM response into structured sections
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

// Mock analysis function for demo purposes
const generateMockAnalysis = (userProfile, scores, maturityTier) => {
  const companySize = userProfile.companySize || 'mid-size';
  const industry = userProfile.industry || 'technology';
  const jobTitle = userProfile.jobTitle || 'Data Professional';
  
  // Generate contextual summary based on maturity tier
  const summaries = {
    'Ad-hoc': `Your organization is in the early stages of data maturity, operating with informal processes and limited data governance. While this presents challenges, it also offers significant opportunities for improvement. Organizations at this level typically struggle with data silos, inconsistent quality, and reactive decision-making. However, ${companySize} companies in ${industry} often see rapid improvements once they begin implementing structured data practices.`,
    
    'Reactive': `Your organization has begun to recognize the importance of data but is still primarily reactive in approach. Basic processes exist but lack consistency and standardization. This is common for ${companySize} organizations in ${industry}, where data initiatives often emerge organically from different departments. The key opportunity lies in transitioning from reactive firefighting to proactive data management.`,
    
    'Developing': `Your organization demonstrates solid progress in data maturity with structured processes beginning to take shape. This places you ahead of many ${companySize} companies in ${industry}. While governance frameworks exist, there are still gaps in implementation and consistency across departments. You're well-positioned to make significant strides toward becoming truly data-driven.`,
    
    'Managed': `Your organization exhibits strong data maturity with comprehensive governance and reliable processes in place. This positions you favorably compared to other ${companySize} organizations in ${industry}. You're making data-informed decisions consistently and have established good practices across most areas. The focus now should be on optimization and advanced analytics capabilities.`,
    
    'Optimized': `Your organization represents best-in-class data maturity with a truly data-driven culture. You're likely among the top performers in ${industry} for ${companySize} companies. Your advanced analytics capabilities and continuous improvement mindset provide significant competitive advantages. The focus should be on maintaining excellence while exploring cutting-edge innovations.`
  };

  // Generate SWOT based on scores and context
  const generateSWOT = () => {
    const swot = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };

    // Identify top performing dimensions as strengths
    const dimensionNames = {
      strategy: 'Strategic Alignment',
      governance: 'Data Governance',
      architecture: 'Data Architecture',
      analytics: 'Analytics Capabilities',
      team: 'Team & Skills',
      quality: 'Data Quality',
      metadata: 'Metadata Management',
      security: 'Security & Risk Management'
    };

    const sortedDimensions = Object.entries(scores.dimensions)
      .sort(([,a], [,b]) => b - a);

    // Top 2 dimensions as strengths
    for (let i = 0; i < 2 && i < sortedDimensions.length; i++) {
      const [dim, score] = sortedDimensions[i];
      swot.strengths.push(`Strong ${dimensionNames[dim]} with score of ${score.toFixed(1)}, indicating well-established practices and processes`);
    }

    // Bottom 2 dimensions as weaknesses
    for (let i = sortedDimensions.length - 2; i < sortedDimensions.length; i++) {
      if (i >= 0) {
        const [dim, score] = sortedDimensions[i];
        swot.weaknesses.push(`${dimensionNames[dim]} needs improvement (${score.toFixed(1)}) to support overall data maturity goals`);
      }
    }

    // Context-based opportunities
    if (maturityTier.name === 'Ad-hoc' || maturityTier.name === 'Reactive') {
      swot.opportunities.push(`Significant potential for quick wins through basic data governance implementation`);
      swot.opportunities.push(`${industry} sector trends toward data-driven decision making create competitive advantage opportunities`);
    } else {
      swot.opportunities.push(`Advanced analytics and AI/ML capabilities to drive innovation in ${industry}`);
      swot.opportunities.push(`Data monetization opportunities through improved data products and services`);
    }

    // Context-based threats
    if (scores.overall < 3) {
      swot.threats.push(`Competitors with stronger data capabilities may gain market advantages`);
      swot.threats.push(`Regulatory compliance risks due to inadequate data governance and security measures`);
    } else {
      swot.threats.push(`Rapid technological changes requiring continuous adaptation of data infrastructure`);
      swot.threats.push(`Data privacy regulations becoming increasingly stringent across industries`);
    }

    return swot;
  };

  return {
    summary: summaries[maturityTier.name] || summaries['Developing'],
    improvements: [], // Legacy field for backward compatibility
    recommendations: [
      {
        title: "Strengthen Data Governance Framework",
        content: `Establish a formal data governance council with representatives from key business areas. Implement DAMA-aligned policies for data stewardship, quality standards, and access controls. This is particularly important for ${companySize} organizations in ${industry} where data complexity is growing rapidly.`
      },
      {
        title: "Enhance Data Quality Management",
        content: `Deploy automated data quality monitoring tools and establish data quality metrics aligned with business objectives. Focus on the most critical data assets that directly impact decision-making in your ${industry} operations.`
      },
      {
        title: "Develop Analytics Capabilities",
        content: `Build self-service analytics capabilities to democratize data access while maintaining governance. Consider implementing modern data stack technologies that align with ${industry} best practices and support your ${companySize} organization's scale.`
      }
    ],
    peerComparison: `Compared to other ${companySize} organizations in ${industry}, your overall score of ${scores.overall.toFixed(1)} places you ${scores.overall >= 3.5 ? 'above average' : scores.overall >= 2.5 ? 'at the industry median' : 'below average but with significant improvement potential'}. Industry leaders in ${industry} typically score 4.0+ across all dimensions, with particular strength in data governance and analytics capabilities.`,
    nextSteps: [
      {
        title: "Phase 1: Foundation (0-3 months)",
        content: "Establish data governance council, conduct comprehensive data inventory, implement basic data quality monitoring, and define clear data ownership roles across business units."
      },
      {
        title: "Phase 2: Implementation (3-6 months)",
        content: "Deploy data quality automation tools, establish master data management practices, implement metadata catalog, and launch pilot analytics projects in high-value use cases."
      },
      {
        title: "Phase 3: Optimization (6+ months)",
        content: "Scale successful analytics initiatives, implement advanced data architecture patterns, establish self-service capabilities, and develop predictive analytics competencies aligned with business strategy."
      }
    ],
    swot: generateSWOT()
  };
}; 