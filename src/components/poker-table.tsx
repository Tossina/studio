import { type Player } from "@/lib/types";
import { PlayerAvatar } from "./player-avatar";
import { Card } from "./ui/card";

interface PokerTableProps {
  players: Player[];
  communityCards: string[];
  pot: number;
}

const SEAT_POSITIONS = [
  { top: "50%", left: "0%", transform: "translateY(-50%)" },
  { top: "15%", left: "15%", transform: "translate(-50%, -50%)" },
  { top: "0%", left: "50%", transform: "translateX(-50%)" },
  { top: "15%", right: "15%", transform: "translate(50%, -50%)" },
  { top: "50%", right: "0%", transform: "translateY(-50%)" },
  { top: "85%", right: "15%", transform: "translate(50%, 50%)" },
  { top: "100%", left: "50%", transform: "translateX(-50%)" },
  { top: "85%", left: "15%", transform: "translate(-50%, 50%)" },
];


export function PokerTable({ players, communityCards, pot }: PokerTableProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-[2/1]">
        {/* Table Felt */}
        <div className="absolute inset-0 bg-green-800 rounded-[50%] border-8 border-yellow-800 shadow-inner"></div>
        
        {/* Inner line */}
        <div className="absolute inset-4 bg-transparent rounded-[50%] border-2 border-yellow-600/50"></div>

        {/* Players */}
        {players.map((player, index) => (
          <div key={player.id} className="absolute" style={SEAT_POSITIONS[player.position -1] || SEAT_POSITIONS[index]}>
             <PlayerAvatar player={player} />
          </div>
        ))}

        {/* Community Cards and Pot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <Card className="bg-background/80 px-4 py-2">
                <p className="text-sm text-muted-foreground">Pot</p>
                <p className="text-lg font-bold text-primary">${pot.toLocaleString()}</p>
            </Card>
            <div className="flex gap-2">
                {communityCards.map((card, index) => (
                    <div key={index} className="w-12 h-16 bg-white rounded-md flex items-center justify-center text-black font-bold text-lg shadow-md">
                        {card}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
