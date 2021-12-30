import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Poll from '@/models/poll';
import type DiscordUser from '@/types/user';
import { verify } from 'jsonwebtoken';
import { config } from '@/utils/config';

export default async function Mine(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token ?? req.headers['authorization'];
  if (!token) return res.status(400).json({ success: false, message: 'No auth :(' });
  const user = verifyUser(token);
  if (!user?.id) return res.status(400).json({ success: false, message: 'No auth :(' });
  await dbConnect();

  const polls = await Poll.find({ owner: user.id });
  if (!polls) return res.status(400).json({ success: false, message: 'Polls not found' });

  return res.status(200).json({ success: true, polls: polls });
}

function verifyUser(token: string): DiscordUser | null {
  try {
    const { iat, exp, ...user } = verify(token, config.jwtSecret) as DiscordUser & { iat: number; exp: number };
    return user;
  } catch (e) {
    return null;
  }
}
