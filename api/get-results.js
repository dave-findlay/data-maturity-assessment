import { head, list } from '@vercel/blob';

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

    // List blobs to find our file (search for files ending with the ID)
    const { blobs } = await list({
      prefix: `results/`,
      limit: 100
    });

    // Find the blob that ends with our ID
    const targetBlob = blobs.find(blob => 
      blob.pathname.includes(`_${id}.json`) || blob.pathname === `results/${id}.json`
    );

    if (!targetBlob) {
      return res.status(404).json({ error: 'Results not found or expired' });
    }

    // Fetch the blob content
    const response = await fetch(targetBlob.url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error retrieving results:', error);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
} 