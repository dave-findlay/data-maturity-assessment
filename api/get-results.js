import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing result ID' });
    }

    // Retrieve from Vercel KV
    const storedData = await kv.get(`results:${id}`);
    
    if (!storedData) {
      return res.status(404).json({ error: 'Results not found or expired' });
    }

    // Parse the stored JSON data
    const data = typeof storedData === 'string' ? JSON.parse(storedData) : storedData;

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error retrieving results:', error);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
} 