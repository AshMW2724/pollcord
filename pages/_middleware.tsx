import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (req?.ua?.isBot) return NextResponse.json({ error: 'You are too intelligent for this website' });
  if (pathname === '/' && req.headers.get('cookie') && parse(req.headers.get('cookie') + '')['token'])
    return NextResponse.rewrite(`/dashboard`);
  return;
}
