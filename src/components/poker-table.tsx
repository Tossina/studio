'use client';
import { type Player } from "@/lib/types";
import { PlayerAvatar } from "./player-avatar";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface PokerTableProps {
  players: Player[];
  communityCards: string[];
  pot: number;
}

const SEAT_POSITIONS = [
  // 9-handed positions for a wider layout
  { top: "50%", left: "-5%", transform: "translateY(-50%)" }, // Seat 1 (SB)
  { top: "15%", left: "10%", transform: "translate(-50%, -50%)" }, // Seat 2
  { top: "0%", left: "35%", transform: "translateX(-50%)" },   // Seat 3
  { top: "0%", right: "35%", transform: "translateX(50%)" },  // Seat 4
  { top: "15%", right: "10%", transform: "translate(50%, -50%)" }, // Seat 5
  { top: "50%", right: "-5%", transform: "translateY(-50%)" }, // Seat 6 (BTN)
  { top: "85%", right: "20%", transform: "translate(50%, 50%)" },// Seat 7
  { top: "100%", left: "50%", transform: "translateX(-50%)" }, // Seat 8 (Hero)
  { top: "85%", left: "20%", transform: "translate(-50%, 50%)" }, // Seat 9
];

export function PokerTable({ players, communityCards, pot }: PokerTableProps) {
  const renderCard = (card: string, index: number) => {
    const isRed = card.includes('♥') || card.includes('♦');
    return (
      <div key={index} className="relative w-12 h-16 bg-white rounded-md flex items-center justify-center text-black font-bold text-2xl shadow-lg border border-gray-200">
        <span className={cn("absolute top-1 left-1.5 text-lg", isRed ? "text-red-600" : "text-black")}>{card.slice(0, -1)}</span>
        <span className={cn("text-2xl", isRed ? "text-red-600" : "text-black")}>{card.slice(-1)}</span>
      </div>
    );
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-5xl aspect-[2/1]">
        {/* Table Felt */}
        <div className="absolute inset-0 bg-card rounded-[8rem] border-4 border-stone-600 shadow-inner">
           <div className="absolute inset-4 rounded-[7rem] border-2 border-stone-500/50"></div>
        </div>
        
        {/* Players */}
        {players.map((player) => {
          const style = SEAT_POSITIONS[player.position - 1];
          if (!style) return null;
          return (
             <div key={player.id} className="absolute" style={style}>
               <PlayerAvatar player={player} />
            </div>
          )
        })}

        {/* Community Cards and Pot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <div className="bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full">
                <p className="text-sm font-semibold text-muted-foreground">
                  POT TOTAL : <span className="font-bold text-lg text-primary">{pot.toLocaleString()} Ar</span>
                </p>
            </div>
            <div className="flex gap-2">
                {communityCards.map(renderCard)}
            </div>
        </div>
      </div>
    </div>
  );
}
