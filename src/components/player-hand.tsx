import { Card as UICard } from "./ui/card";
import { cn } from "@/lib/utils";

interface PlayerHandProps {
    cards: [string, string];
}

const CardDisplay = ({ card }: { card: string }) => {
    const isRed = card.includes('♥') || card.includes('♦');
    return (
        <div className="relative w-16 h-24 bg-white rounded-lg flex items-center justify-center text-black font-bold text-3xl shadow-lg border-2 border-gray-200">
             <span className={cn("absolute top-1 left-2 text-xl", isRed ? "text-red-600" : "text-black")}>{card.slice(0, -1)}</span>
            <span className={cn("text-4xl", isRed ? "text-red-600" : "text-black")}>{card.slice(-1)}</span>
        </div>
    )
}

export function PlayerHand({ cards }: PlayerHandProps) {
    return (
        <div className="flex items-center justify-center gap-2">
            <CardDisplay card={cards[0]} />
            <CardDisplay card={cards[1]} />
        </div>
    );
}
