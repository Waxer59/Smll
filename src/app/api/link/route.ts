import { NextResponse } from 'next/server';

// TODO: Implement link route
export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello World' });
}
