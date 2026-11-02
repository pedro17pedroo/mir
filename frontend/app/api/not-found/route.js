import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
