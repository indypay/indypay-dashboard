import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(403).json({ message: 'Access forbidden: insufficient role' });
}
