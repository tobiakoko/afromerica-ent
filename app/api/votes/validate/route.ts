import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  return fetch(`${request.nextUrl.origin}/api/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
