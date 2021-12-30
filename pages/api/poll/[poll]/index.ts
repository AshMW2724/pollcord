import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Poll from '@/models/poll';

export default async function Mine(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const poll = await Poll.findOne({ id: req.query.poll });
  if (!poll) return res.status(400).json({ success: false, message: 'Poll not found' });

  return res.status(200).json({ success: true, polls: poll });
}
