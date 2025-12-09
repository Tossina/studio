import { type Player, type Game, type GameVariant, type GameFormat } from './types';
import { PlaceHolderImages } from './placeholder-images';

const variants: GameVariant[] = ["Texas Hold'em", "Omaha", "Stud", "Draw"];
const formats: GameFormat[] = ["Cash Game", "MTT", "Sit & Go"];

export const mockGames: Game[] = Array.from({ length: 20 }, (_, i) => ({
  id: `game-${i + 1}`,
  name: `Table ${i + 1}`,
  variant: variants[i % variants.length],
  format: formats[i % formats.length],
  stakes: `$${(i % 5) + 1}/${((i % 5) + 1) * 2}`,
  players: Math.floor(Math.random() * 8) + 1,
  maxPlayers: 9,
  limit: i % 2 === 0 ? 'No Limit' : 'Pot Limit',
}));

const avatarIds = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6'];

export const mockPlayers: Player[] = Array.from({ length: 6 }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Player ${i + 1}`,
    avatarUrl: PlaceHolderImages.find(img => img.id === avatarIds[i])?.imageUrl || '',
    stack: Math.floor(Math.random() * 1000) + 500,
    isDealer: i === 0,
    isTurn: i === 3,
    cards: i === 2 ? ['As', 'Ks'] : null, // Only show cards for our hero player
    position: i + 1,
    action: i === 1 ? 'bet' : null,
    betAmount: i === 1 ? 50 : 0,
}));
