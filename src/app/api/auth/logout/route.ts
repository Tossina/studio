import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    (await cookies()).delete('token');
    return NextResponse.json({ success: true });
}
