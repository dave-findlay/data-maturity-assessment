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

    // Construct the blob URL
    const blobUrl = `${process.env.BLOB_READ_WRITE_TOKEN ? 'https://' + process.env.VERCEL_URL : 'https://your-domain.vercel.app'}/_vercel/blob/results/${id}.json`;
    
    // Fetch from Vercel Blob
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Results not found or expired' });
      }
      throw new Error(`Blob fetch failed: ${response.status}`);
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