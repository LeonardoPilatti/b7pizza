import { hasEmail } from '@/services/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) return NextResponse.json({ exists: false });

  const hasRegisteredEmail = await hasEmail(email);

  if (!hasRegisteredEmail) return NextResponse.json({ exists: false });

  return NextResponse.json({ exists: true });
}
