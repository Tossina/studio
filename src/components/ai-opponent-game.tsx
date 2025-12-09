"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { getAiMoveAction } from "@/app/actions";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import type { PokerDecisionOutput } from "@/ai/flows/ai-opponent";
import { Badge } from "./ui/badge";

export function AIOpponentGame() {
    const [isLoading, setIsLoading] = useState(false);
    const [aiMove, setAiMove] = useState<PokerDecisionOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleGetAiMove = async () => {
        setIsLoading(true);
        setAiMove(null);
        setError(null);

        const result = await getAiMoveAction({
            gameType: 'Texas Holdem',
            gameState: 'Heads up, post-flop. Pot is 150 Ar. Community cards are Ah, 10d, 2c. Hero (user) is out of position and checks.',
            playerCards: 'Ac Kc'
        });

        if (result.success && result.data) {
            setAiMove(result.data);
        } else {
            setError(result.error || "Une erreur inconnue est survenue.");
        }
        setIsLoading(false);
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="text-primary" />
                    Adversaire IA
                </CardTitle>
                <CardDescription>
                    Entraînez-vous sur une main contre notre IA. Voyez comment elle jouerait dans votre situation.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center gap-4">
                <div className="text-sm space-y-2 p-3 bg-muted/50 rounded-lg">
                    <p><span className="font-semibold">Votre Main :</span> Ac Kc</p>
                    <p><span className="font-semibold">Board :</span> Ah 10d 2c</p>
                    <p><span className="font-semibold">Votre Action :</span> Check</p>
                </div>
                <Button onClick={handleGetAiMove} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Obtenir le coup de l'IA
                </Button>
            </CardContent>
            {aiMove && (
                <CardContent>
                    <Alert>
                        <AlertTitle className="flex items-center justify-between">
                            <span>L'IA choisit de <span className="font-bold uppercase text-primary">{aiMove.action}</span></span>
                            {aiMove.action === 'raise' && <Badge>{aiMove.betSize} Ar</Badge>}
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                            <strong>Raisonnement :</strong> {aiMove.reasoning}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            )}
             {error && (
                <CardContent>
                    <Alert variant="destructive">
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            )}
        </Card>
    );
}
