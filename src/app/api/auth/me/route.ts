import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = AuthService.verifyToken(token);

    if (!payload) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await AuthService.getUser(payload.userId);

    if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    // Remove passwordHash from response
    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({ user: safeUser });
}
