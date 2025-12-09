import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PlayerHandProps {
    cards: [string, string];
}

export function PlayerHand({ cards }: PlayerHandProps) {
    return (
        <Card className="p-4 bg-card/80">
            <div className="flex items-center gap-4">
                <CardTitle className="text-sm font-semibold">Your Hand</CardTitle>
                <div className="flex gap-2">
                    {cards.map((card, index) => (
                        <div key={index} className="w-12 h-16 bg-white rounded-md flex items-center justify-center text-black font-bold text-lg shadow-md">
                            {card}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
