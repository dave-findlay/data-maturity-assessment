import { kv } from '@vercel/kv';

// Generate a short, URL-friendly ID
function generateResultId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
    const { userProfile, results } = req.body;
    
    if (!userProfile || !results) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Generate unique ID
    const resultId = generateResultId();
    
    // Prepare data for storage
    const dataToStore = {
      userProfile,
      results,
      createdAt: new Date().toISOString(),
      id: resultId
    };

    // Store in Vercel KV with expiration (90 days)
    await kv.setex(`results:${resultId}`, 90 * 24 * 60 * 60, JSON.stringify(dataToStore));

    // Get the origin from headers or use a default
    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'https://your-domain.vercel.app';

    // Return the ID for creating the shareable URL
    res.status(200).json({ 
      success: true, 
      resultId,
      shareUrl: `${origin}/results/${resultId}`
    });

  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ error: 'Failed to save results' });
  }
} 