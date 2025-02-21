import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.body;

  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.NEXT_PUBLIC_BRAVE_API_KEY,
      },
      params: { q: query },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}