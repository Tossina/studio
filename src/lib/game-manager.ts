import { Server, Socket } from 'socket.io';
import prisma from './db';
import { Game, Player, PlayerAction } from './types';

interface GameState extends Game {
    // runtime specific properties if any
}

class GameManager {
    private games: Map<string, GameState> = new Map();
    private io: Server | null = null;

    initialize(io: Server) {
        this.io = io;
    }

    async getGame(gameId: string): Promise<GameState | null> {
        if (this.games.has(gameId)) {
            return this.games.get(gameId)!;
        }

        // Load from DB
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            include: { players: true }
        });

        if (!game) return null;

        // Map Prisma Game to GameState
        const gameState: GameState = {
            id: game.id,
            name: game.name,
            gameVariant: game.variant as any,
            gameFormat: game.format as any,
            stakes: `${game.smallBlind}/${game.bigBlind} Ar`,
            players: game.players.map(p => ({
                id: p.userId, // Map userId to Player.id for frontend
                // We need to fetch User details (name, avatar) separately or include them
                // For now, minimal mapping
                name: "Player " + p.userId.substring(0, 4),
                avatarUrl: "",
                stack: p.stack,
                isDealer: p.isDealer,
                isTurn: p.isTurn,
                cards: p.cards ? JSON.parse(p.cards) : null,
                position: p.position,
                action: null,
                betAmount: p.currentBet
            })),
            maxPlayers: game.maxPlayers,
            limit: 'No Limit',
            status: game.status as any,
            playerIds: game.players.map(p => p.userId),
            startTime: game.createdAt.toISOString(),
            communityCards: game.communityCards ? JSON.parse(game.communityCards) : [],
            pot: game.pot,
            currentPlayerId: game.currentTurnPlayerId || "",
            gamePhase: 'pre-flop', // simplified
            dealerPosition: game.dealerPosition
        };

        this.games.set(gameId, gameState);
        return gameState;
    }

    async joinGame(socket: Socket, gameId: string, userId: string) {
        const game = await this.getGame(gameId);
        if (!game) {
            socket.emit('error', 'Game not found');
            return;
        }

        socket.join(gameId);

        // Check if player is already in game (Prisma check handled by getGame usually)
        // If not, we might need to add them to DB?
        // For now, assume player joined via API or is spectator.
        // If in playerIds, send private state.

        this.emitGameState(gameId);
    }

    emitGameState(gameId: string) {
        const game = this.games.get(gameId);
        if (!game || !this.io) return;

        this.io.to(gameId).emit('game-state', game);
    }

    async handleAction(gameId: string, userId: string, action: string, amount?: number) {
        const game = await this.getGame(gameId);
        if (!game) return;

        console.log(`Action in game ${gameId} by ${userId}: ${action} ${amount || ''}`);

        // Validate action type
        const validActions: PlayerAction[] = ['bet', 'check', 'fold', 'raise', 'call'];
        if (!validActions.includes(action as PlayerAction)) {
            console.error("Invalid action:", action);
            return;
        }

        // Validate turn
        // if (game.currentPlayerId !== userId) return;

        // Process action (mock)
        const player = game.players.find(p => p.id === userId);
        if (player) {
            player.action = action as PlayerAction;
            if (amount) player.betAmount = amount;
        }

        // Next turn logic (mock)
        // pass turn to next player...

        // Persist to DB (async)
        // await prisma.game.update(...)

        this.emitGameState(gameId);
    }
}

export const gameManager = new GameManager();
