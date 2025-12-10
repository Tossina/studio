import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
    try {
        const games = await prisma.game.findMany({
            include: {
                players: true,
            },
        });

        // Transform Prisma Game to lib/types Game if needed
        // The types roughly match, but need to check
        const mappedGames = games.map(g => ({
            ...g,
            stakes: `${g.smallBlind}/${g.bigBlind} Ar`, // Format derived from DB
            playerIds: g.players.map(p => p.userId),
            gameVariant: g.variant as any, // Cast string to "Texas Hold'em" etc
            gameFormat: g.format as any,
            subVariant: 'Regular', // Default for now
        }));

        return NextResponse.json(mappedGames);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { cookies } from 'next/headers';
import { AuthService } from '@/lib/auth-service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, gameVariant, gameFormat, stakes, maxPlayers } = body;

        const token = (await cookies()).get('token')?.value;
        let userId: string | undefined;

        if (token) {
            const payload = AuthService.verifyToken(token);
            if (payload) userId = payload.userId;
        }

        // Parse stakes '10/20' -> 10, 20
        const [sb, bb] = stakes ? stakes.split('/').map((s: string) => parseFloat(s)) : [1, 2];

        const game = await prisma.game.create({
            data: {
                name: name || "Table sans nom",
                variant: gameVariant,
                format: gameFormat,
                maxPlayers: parseInt(maxPlayers) || 6,
                smallBlind: sb,
                bigBlind: bb,
                status: 'WAITING',
                players: userId ? {
                    create: {
                        userId: userId,
                        position: 1,
                        stack: 10000, // Default stack
                        isDealer: true,
                        status: 'ACTIVE'
                    }
                } : undefined
            },
            include: {
                players: true
            }
        });

        return NextResponse.json(game);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
