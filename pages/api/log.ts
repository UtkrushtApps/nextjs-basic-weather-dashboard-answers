import type { NextApiRequest, NextApiResponse } from 'next';

// Mock logging handler
type Data = {
  status: 'ok';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Simulate async logging, like writing to a database
  await new Promise((resolve) => setTimeout(resolve, 200));
  // You could capture the log in-memory if desired
  // but for this mock, just respond OK
  res.status(200).json({ status: 'ok' });
}
