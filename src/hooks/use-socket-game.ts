"use client";

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { useAuth } from '@/providers/auth-provider';
import { Game } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export function useSocketGame(gameId: string) {
    const { user, loading } = useAuth();
    const [game, setGame] = useState<Game | null>(null);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        if (loading || !user) return;

        function onConnect() {
            setIsConnected(true);
            console.log('Socket connected, joining game...');
            socket.emit('join-game', { gameId, userId: user?.id });
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onGameState(gameState: Game) {
            // console.log('Game state received', gameState);
            setGame(gameState);
        }

        function onError(msg: string) {
            toast({ title: "Erreur", description: msg, variant: "destructive" });
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('game-state', onGameState);
        socket.on('error', onError);

        // Initial join if already connected
        if (socket.connected) {
            onConnect();
        } else {
            socket.connect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('game-state', onGameState);
            socket.off('error', onError);
            // socket.emit('leave-game', gameId); // Optional
        };
    }, [gameId, user, loading]);

    const sendAction = (action: string, amount?: number) => {
        if (!user) return;
        socket.emit('player-action', { gameId, userId: user.id, action, amount });
    };

    return { game, isConnected, sendAction };
}
