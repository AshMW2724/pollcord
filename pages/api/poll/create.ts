import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Poll from '@/models/poll';
import type DiscordUser from '@/types/user';
import { verify } from 'jsonwebtoken';
import { config } from '@/utils/config';

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default async function Create(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token ?? req.headers['authorization'];
  if (!token) return res.status(400).json({ success: false, message: 'No auth :(' });
  const user = verifyUser(token);
  if (!user?.id) return res.status(400).json({ success: false, message: 'No auth :(' });
  if (req.method !== 'POST') return res.status(400).json({ success: false, message: 'Gotta post something buddy...' });
  await dbConnect();
  if (!req.body) return res.status(400).json({ success: false, message: 'Gotta post something buddy...' });
  if (!['name', 'prompt', 'options'].every((x) => req.body.hasOwnProperty(x)))
    return res.status(400).json({
      success: false,
      message: `${['name', 'prompt', 'options']
        .filter((x) => (req.body.hasOwnProperty(x) ? false : true))
        .join(', ')} required`,
    });
  if (req.body.options.length < 2 || req.body.options.length > 10)
    return res.status(400).json({ success: false, message: 'Options must be between 2 and 10.' });

  let gennedId = '';
  for (let i = 0; i < 15; i++) gennedId += possible.charAt(Math.floor(Math.random() * possible.length));

  try {
    const polls = await Poll.create({
      id: gennedId,
      owner: user.id,
      name: req.body.name,
      prompt: req.body.prompt,
      options: req.body.options,
    });
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
