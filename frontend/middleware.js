import { NextResponse } from 'next/server';

export function middleware(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return NextResponse.next();

  const authHeader = request.headers.get('authorization') ?? '';
  if (authHeader.startsWith('Basic ')) {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString();
    const userPwd = decoded.slice(decoded.indexOf(':') + 1);
    if (userPwd === password) return NextResponse.next();
  }

  return new NextResponse('Toegang geweigerd', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="HartjeU Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
