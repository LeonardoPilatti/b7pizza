import { createUser, createUserToken, hasEmail } from '@/services/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Campos incompletos.' }, { status: 400 });
  }

  const hasRegisteredEmail = await hasEmail(email);
  if (hasRegisteredEmail)
    return NextResponse.json({ error: 'Email já existe.' }, { status: 400 });

  const newUser = await createUser(name, email, password);
  if (!newUser)
    return NextResponse.json(
      { error: 'Erro ao criar usuário.' },
      { status: 400 },
    );

  const token = await createUserToken(newUser.id);
  return NextResponse.json({ user: newUser, token }, { status: 201 });
}
