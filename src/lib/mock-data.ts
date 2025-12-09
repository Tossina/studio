import { type Player, type Game, type GameVariant, type GameFormat } from './types';
import { PlaceHolderImages } from './placeholder-images';

const variants: GameVariant[] = ["Texas Hold'em", "Omaha"];
const formats: GameFormat[] = ["Cash Game", "MTT", "Sit & Go"];
const subVariants: Game['subVariant'][] = ['Rapide', 'Hyper', 'Deepstack', 'Regular'];
const statuses: Game['status'][] = ['EN COURS', 'TARDIF', 'INSCRIPTION'];

export const mockGames: Game[] = Array.from({ length: 20 }, (_, i) => {
    const format = formats[i % formats.length];
    const isTournament = format === 'MTT';
    return {
        id: `game-${i + 1}`,
        name: isTournament ? ['Antananarivo Cup', 'Tamatave Deep', 'Fianara Speed'][i%3] : ['Nosy Be Turbo', 'Majunga Kings', 'Diego Suarez Bay'][i%3],
        variant: variants[i % variants.length],
        format: format,
        stakes: `$${(i % 5) + 1}/${((i % 5) + 1) * 2}`,
        players: Math.floor(Math.random() * 8) + 1,
        maxPlayers: isTournament ? 100 : (format === 'Sit & Go' ? 6 : 9),
        limit: i % 2 === 0 ? 'No Limit' : 'Pot Limit',
        subVariant: subVariants[i % subVariants.length],
        buyIn: isTournament || format === 'Sit & Go' ? [5000, 10000, 25000][i%3] : undefined,
        prizePool: isTournament ? 450000 : undefined,
        status: statuses[i % statuses.length],
    };
});


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
