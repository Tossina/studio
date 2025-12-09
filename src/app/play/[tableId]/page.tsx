import { ActionButtons } from "@/components/action-buttons";
import { AIOpponentGame } from "@/components/ai-opponent-game";
import { ChatBox } from "@/components/chat-box";
import { PlayerHand } from "@/components/player-hand";
import { PokerTable } from "@/components/poker-table";
import { mockPlayers } from "@/lib/mock-data";

export default function PlayPage({ params }: { params: { tableId: string } }) {
  const heroPlayer = mockPlayers.find(p => p.cards !== null);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Main game area */}
      <div className="flex-grow flex flex-col p-4 gap-4">
        <div className="flex-grow relative">
          <PokerTable players={mockPlayers} communityCards={["Ah", "Kd", "7c"]} pot={1250} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            {heroPlayer && <PlayerHand cards={heroPlayer.cards || ['','']} />}
            <ActionButtons playerStack={heroPlayer?.stack || 1000} currentBet={50} />
        </div>
      </div>

      {/* Side panel */}
      <aside className="w-full lg:w-96 border-l flex flex-col shrink-0">
        <div className="flex-grow p-4">
            <AIOpponentGame />
        </div>
        <div className="border-t">
          <ChatBox />
        </div>
      </aside>
    </div>
  );
}
