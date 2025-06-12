import { put } from '@vercel/blob';

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

  try {
    const errorData = req.body;
    
    if (!errorData || !errorData.id) {
      return res.status(400).json({ error: 'Missing error data' });
    }

    // Create filename with company name prefix if available
    const companyName = errorData.companyName || 'Unknown-Company';
    const sanitizedCompanyName = companyName.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 50);
    const filename = `${sanitizedCompanyName}_${errorData.id}.json`;

    // Store error log in Vercel Blob
    const blob = await put(`errors/${filename}`, JSON.stringify(errorData, null, 2), {
      access: 'public',
      addRandomSuffix: false
    });

    console.log(`🐛 Error logged: ${errorData.id}`, {
      type: errorData.type,
      timestamp: errorData.timestamp,
      blobUrl: blob.url
    });

    res.status(200).json({ 
      success: true, 
      errorId: errorData.id,
      blobUrl: blob.url
    });

  } catch (error) {
    console.error('Error logging to blob storage:', error);
    res.status(500).json({ error: 'Failed to log error' });
  }
} 