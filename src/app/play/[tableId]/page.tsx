'use client';
import { ActionButtons } from "@/components/action-buttons";
import { ChatBox } from "@/components/chat-box";
import { PlayerHand } from "@/components/player-hand";
import { PokerTable } from "@/components/poker-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DoorOpen, History, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Game } from "@/lib/types";

export default function PlayPage() {
  const params = useParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const tableId = params.tableId as string;
  
  const gameRef = useMemoFirebase(() => {
    if (!firestore || !tableId) return null;
    return doc(firestore, 'pokerGames', tableId);
  }, [firestore, tableId]);

  const { data: game, isLoading: isGameLoading } = useDoc<Game>(gameRef);

  const heroPlayer = game?.players.find(p => p.id === user?.uid);

  if (isUserLoading || isGameLoading || !game || !user) {
    return <div className="flex-grow flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
  }
  
  if (!heroPlayer) {
     return (
        <div className="flex-grow flex flex-col items-center justify-center text-center gap-4">
          <h1 className="text-2xl font-bold">Vous n'êtes pas à cette table.</h1>
          <p className="text-muted-foreground">Vous pouvez rejoindre la partie depuis le lobby.</p>
          <Button asChild>
            <Link href="/lobby">Retourner au Lobby</Link>
          </Button>
        </div>
      );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Main game area */}
      <main className="flex-grow flex flex-col">
        <div className="p-4 space-y-1">
          <h1 className="text-lg font-bold text-white">Table: {game.name} #{tableId.substring(0,5)}</h1>
          <p className="text-sm text-muted-foreground">Blinds: {game.stakes} Ar</p>
        </div>
        
        <div className="flex-grow relative flex items-center justify-center">
          <PokerTable players={game.players} communityCards={game.communityCards} pot={game.pot} dealerPosition={game.dealerPosition} currentPlayerId={game.currentPlayerId} />
        </div>
        
        <div className="p-4 flex flex-col items-center gap-4">
            <div className="flex items-end gap-4">
              <PlayerHand cards={heroPlayer.cards || [' ', ' ']} />
              {heroPlayer.handRank && <div className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded-full">{heroPlayer.handRank.toUpperCase()}</div>}
            </div>
            <ActionButtons playerStack={heroPlayer.stack} currentBet={0} minRaise={2000} />
        </div>
      </main>

      {/* Side panel */}
      <aside className="w-full lg:w-80 bg-secondary border-l flex flex-col shrink-0">
        <Card className="bg-transparent border-0 rounded-none">
          <CardHeader>
            <div className="flex justify-between items-center">
               <CardTitle className="text-base font-bold text-muted-foreground">MON SOLDE</CardTitle>
               <Button variant="link" size="sm" className="text-xs text-primary h-auto p-0">Historique</Button>
            </div>
            <p className="text-2xl font-bold text-white">{heroPlayer.stack.toLocaleString('fr-FR')} Ar</p>
            <CardDescription className="text-xs">Disponible sur cette table</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-muted-foreground">RECHARGEMENT RAPIDE</p>
              <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-14 flex flex-col gap-1 bg-card hover:bg-accent">Mvola</Button>
                  <Button variant="outline" className="h-14 flex flex-col gap-1 bg-card hover:bg-accent">Orange</Button>
                  <Button variant="outline" className="h-14 flex flex-col gap-1 bg-card hover:bg-accent">Airtel</Button>
              </div>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/lobby"><DoorOpen className="mr-2"/>Quitter la table</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-2 bg-border/50" />

        <div className="p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-muted-foreground">
            <History className="w-4 h-4"/>
            <span>MAINS PRÉCÉDENTES</span>
          </div>
          <div className="space-y-1 pl-1">
             <div className="flex justify-between items-center">
              <p className="text-green-400">Gagné (Paire As)</p>
              <p className="font-semibold text-green-400">+2,400 Ar</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Perdu (Fold)</p>
              <p className="font-semibold text-muted-foreground">-500 Ar</p>
            </div>
          </div>
        </div>

        <Separator className="my-2 bg-border/50" />

        <div className="flex-grow flex flex-col min-h-0">
            <p className="p-4 text-xs font-bold text-muted-foreground">CHAT DE LA TABLE</p>
            <div className="flex-grow min-h-0">
              <ChatBox />
            </div>
        </div>
      </aside>
    </div>
  );
}
