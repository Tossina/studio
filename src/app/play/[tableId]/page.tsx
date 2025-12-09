'use client';
import { ActionButtons } from "@/components/action-buttons";
import { ChatBox } from "@/components/chat-box";
import { PlayerHand } from "@/components/player-hand";
import { PokerTable } from "@/components/poker-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockPlayers } from "@/lib/mock-data";
import { Clock, History, Loader2 } from "lucide-react";

export default function PlayPage({ params: { tableId } }: { params: { tableId: string } }) {
  const heroPlayer = mockPlayers.find(p => p.name.includes('Hero'));
  const communityCards = ["A♥", "T♦", "J♣", "K♣", "Q♠"]

  if (!heroPlayer) {
    return <div className="flex-grow flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Main game area */}
      <main className="flex-grow flex flex-col">
        <div className="p-4 space-y-1">
          <h1 className="text-lg font-bold text-white">Table: Antananarivo #{tableId}</h1>
          <p className="text-sm text-muted-foreground">Blinds: 500/1000 Ar</p>
        </div>
        
        <div className="flex-grow relative flex items-center justify-center">
          <PokerTable players={mockPlayers} communityCards={communityCards} pot={45000} />
        </div>
        
        <div className="p-4 flex flex-col items-center gap-4">
            <div className="flex items-end gap-4">
              <PlayerHand cards={heroPlayer.cards || ['', '']} />
              <div className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded-full">FLUSH DRAW</div>
            </div>
            <ActionButtons playerStack={heroPlayer.stack} currentBet={1000} minRaise={2000} />
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
            <p className="text-2xl font-bold text-white">25,400 Ar</p>
            <CardDescription className="text-xs">Disponible pour jouer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-bold text-muted-foreground mb-2">RECHARGEMENT RAPIDE</p>
            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="h-14 flex flex-col gap-1 bg-card hover:bg-accent">Mvola</Button>
                <Button variant="outline" className="h-14 flex flex-col gap-1 bg-card hover:bg-accent">Orange</Button>
                <Button variant="outline" className="h-14 flex flex-col gap-1 bg-card hover:bg-accent">Airtel</Button>
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
            <p className="p-4 text-xs font-bold text-muted-foreground">TABLE CHAT</p>
            <div className="flex-grow min-h-0">
              <ChatBox />
            </div>
        </div>
      </aside>
    </div>
  );
}
