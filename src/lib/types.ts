export type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  stack: number;
  isDealer: boolean;
  isTurn: boolean;
  cards: [string, string] | null;
  position: number; // Seat number
  action: 'bet' | 'check' | 'fold' | null;
  betAmount: number;
};

export type GameVariant = "Texas Hold'em" | 'Omaha' | 'Stud' | 'Draw';

export type GameFormat = 'Cash Game' | 'MTT' | 'Sit & Go' | 'Fast Poker';

export type Game = {
  id: string;
  name: string;
  variant: GameVariant;
  format: GameFormat;
  stakes: string;
  players: number;
  maxPlayers: number;
  limit: string;
  subVariant?: 'Rapide' | 'Hyper' | 'Deepstack' | 'Regular';
  buyIn?: number;
  prizePool?: number;
  status: 'EN COURS' | 'TARDIF' | 'INSCRIPTION';
};
