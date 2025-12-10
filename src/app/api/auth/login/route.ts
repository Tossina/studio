import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { user, token } = await AuthService.login({ email, password });

        // Set cookie
        (await cookies()).set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({ user, token });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
