'use client';
import { AIVariantSuggester } from "@/components/ai-variant-suggester";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/firebase";
import { mockGames } from "@/lib/mock-data";
import { Game, GameFormat, GameVariant } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const gameVariants: GameVariant[] = ["Texas Hold'em", "Omaha", "Stud", "Draw"];
const gameFormats: GameFormat[] = ["Cash Game", "MTT", "Sit & Go", "Fast Poker"];

function GameList({ games }: { games: Game[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Stakes</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell className="font-medium">{game.name}</TableCell>
              <TableCell>{game.stakes}</TableCell>
              <TableCell>{`${game.players}/${game.maxPlayers}`}</TableCell>
              <TableCell>{game.limit}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/play/${game.id}`}>Join Table</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function LobbyPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-4 font-headline">Game Lobby</h1>
          <Tabs defaultValue="Texas Hold'em" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              {gameVariants.map((variant) => (
                <TabsTrigger key={variant} value={variant}>
                  {variant}
                </TabsTrigger>
              ))}
            </TabsList>

            {gameVariants.map((variant) => (
              <TabsContent key={variant} value={variant}>
                <Tabs defaultValue="Cash Game" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
                    {gameFormats.map((format) => (
                       <TabsTrigger key={format} value={format}>
                         {format}
                       </TabsTrigger>
                    ))}
                  </TabsList>
                  {gameFormats.map((format) => (
                     <TabsContent key={format} value={format}>
                        <GameList games={mockGames.filter(g => g.variant === variant && g.format === format)} />
                     </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div className="lg:w-1/4">
            <AIVariantSuggester />
        </div>
      </div>
    </div>
  );
}
