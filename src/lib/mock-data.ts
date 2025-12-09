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


const avatarIds = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6', 'avatar-1', 'avatar-2', 'avatar-3'];

export const mockPlayers: Player[] = [
  { id: 'player-1', name: 'Rary', avatarUrl: PlaceHolderImages.find(p => p.id === avatarIds[0])?.imageUrl || '', stack: 12500, isDealer: false, isTurn: false, cards: null, position: 2, action: 'bet', betAmount: 1000 },
  { id: 'player-2', name: 'Hery', avatarUrl: PlaceHolderImages.find(p => p.id === avatarIds[1])?.imageUrl || '', stack: 0, isDealer: false, isTurn: false, cards: null, position: 3, action: 'fold', betAmount: 0 },
  { id: 'player-3', name: 'Soa', avatarUrl: PlaceHolderImages.find(p => p.id === avatarIds[2])?.imageUrl || '', stack: 18200, isDealer: false, isTurn: true, cards: null, position: 5, action: null, betAmount: 0 },
  { id: 'player-4', name: 'Faly', avatarUrl: PlaceHolderImages.find(p => p.id === avatarIds[3])?.imageUrl || '', stack: 8000, isDealer: true, isTurn: false, cards: null, position: 7, action: null, betAmount: 0 },
  { id: 'player-5', name: 'Hero (Moi)', avatarUrl: PlaceHolderImages.find(p => p.id === avatarIds[4])?.imageUrl || '', stack: 25400, isDealer: false, isTurn: false, cards: ['A♥', 'K♦'], position: 8, action: 'call', betAmount: 1000 },
]

// Add empty seats
const totalSeats = 9;
const seatedPlayerPositions = new Set(mockPlayers.map(p => p.position));
for (let i = 1; i <= totalSeats; i++) {
    if (!seatedPlayerPositions.has(i)) {
        mockPlayers.push({
            id: `empty-${i}`,
            name: 'Siège vide',
            avatarUrl: '',
            stack: 0,
            isDealer: false,
            isTurn: false,
            cards: null,
            position: i,
            action: null,
            betAmount: 0,
        });
    }
}

mockPlayers.sort((a, b) => a.position - b.position);
