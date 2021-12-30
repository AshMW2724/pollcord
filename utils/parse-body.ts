import { NextApiRequest } from 'next/types';

const webhookPayloadParser = (req: NextApiRequest) =>
  new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data).toString());
    });
  });
export default webhookPayloadParser;
