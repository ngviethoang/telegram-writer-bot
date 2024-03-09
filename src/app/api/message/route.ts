import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(JSON.stringify(body, null, 2));

  const { sender, type } = body;

  if (!sender) {
    return NextResponse.json({ message: 'Invalid sender' }, { status: 400 });
  }

  if (!type) {
    return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
