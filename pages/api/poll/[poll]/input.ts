import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Poll from '@/models/poll';
import type DiscordUser from '@/types/user';
import { verify } from 'jsonwebtoken';
import { config } from '@/utils/config';

export default async function Input(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token ?? req.headers['authorization'];
  if (!token) return res.status(400).json({ success: false, message: 'No auth :(' });
  const user = verifyUser(token);
  if (!user?.id) return res.status(400).json({ success: false, message: 'No auth :(' });
  if (req.method !== 'POST' || !req.body)
    return res.status(400).json({ success: false, message: 'Gotta post something buddy...' });
  await dbConnect();
  if (!req.query.hasOwnProperty('poll'))
    return res.status(400).json({ success: false, message: 'Make sure to add the poll ID' });
  const poll = await Poll.findOne({ id: req.query.poll });
  if (!poll) return res.status(400).json({ success: false, message: 'Poll not found' });
  if (!poll.open) return res.status(400).json({ success: false, message: 'Poll is closed' });
  if (poll.inputs.find((m: { id: string }) => m.id === user.id))
    return res.status(400).json({ success: false, message: 'You already voted' });
  if (req.body.input > poll.inputs.options || req.body.input < 0)
    return res.status(400).json({ success: false, message: 'Bad Number' });
  try {
    const polls = await Poll.updateOne(
      { _id: poll._id },
      { $set: { inputs: [...poll.inputs, { id: user.id, input: req.body.input }] } }
    );
    res.status(200).json({ success: true, data: polls });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
}

function verifyUser(token: string): DiscordUser | null {
  try {
    const { iat, exp, ...user } = verify(token, config.jwtSecret) as DiscordUser & { iat: number; exp: number };
    return user;
  } catch (e) {
    return null;
  }
}
