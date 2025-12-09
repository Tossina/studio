'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Game } from "@/lib/types";
import { Flame, Loader2, RefreshCw, Spade, Users, ArrowRight, Trophy, Droplets, Rabbit, Plus, Gamepad2, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { collection, Query } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateGameForm } from "@/components/create-game-form";
import { AIVariantSuggester } from "@/components/ai-variant-suggester";
import { AIOpponentGame } from "@/components/ai-opponent-game";
import { Separator } from "@/components/ui/separator";

const gameTypes = [
  { id: "all", name: "Tous les jeux", icon: Spade },
  { id: "Texas Hold'em", name: "Texas Hold'em", icon: Spade },
  { id: "Omaha", name: "Omaha", icon: Spade },
];

const gameFormats = [
  { id: "cash", name: "Cash Game", format: "Cash Game" },
  { id: "sit-go", name: "Sit & Go", format: "Sit & Go" },
  { id: "tournament", name: "Tournois", format: "MTT" },
];

const stakeLevels = ["Tous", "Micro", "Basse", "Moyenne", "Haute"];

function GameCard({ game }: { game: Game }) {
  const isTournament = game.gameFormat === 'MTT';
  const isInscription = game.gameFormat === 'Sit & Go';

  const formatIcons: { [key: string]: React.ElementType } = {
    'Rapide': Flame,
    'Hyper': Rabbit,
    'Deepstack': Droplets,
  };
  // The subVariant might not exist on the game object, so we default to an empty string.
  const SubVariantIcon = game.subVariant ? formatIcons[game.subVariant] : null;

  return (
    <Card className="bg-card/80 border-border hover:border-primary/50 transition-all">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isTournament ? <Trophy className="w-5 h-5 text-amber-400"/> : <Flame className="w-5 h-5 text-red-500"/>}
              <h3 className="text-lg font-bold">{game.name || `Game #${game.id.substring(0, 5)}`}</h3>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{game.gameVariant} {game.limit}</span>
              {SubVariantIcon && game.subVariant && <><span>•</span> <SubVariantIcon className="w-3 h-3"/><span>{game.subVariant}</span></>}
            </p>
          </div>
          <div className="text-center">
             <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold leading-none flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                EN COURS
              </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
            <div className="space-y-1 text-sm">
                <p className="text-xs text-muted-foreground">{isTournament ? 'BUY-IN' : 'BLINDS'}</p>
                <p className="font-bold text-base">{isTournament ? `${game.buyIn} Ar` : `${game.stakes} Ar`}</p>
            </div>
             <div className="space-y-1 text-sm text-right">
                <p className="text-xs text-muted-foreground">{isTournament || isInscription ? 'INSCRITS' : 'JOUEURS'}</p>
                <p className="font-bold text-base">{game.players} / {game.maxPlayers}</p>
            </div>
        </div>
        
        {isTournament && game.prizePool && (
            <p className="text-xs text-center text-amber-400/80">Prize pool: <span className="font-bold">{game.prizePool} Ar</span></p>
        )}

        <div className="flex items-center gap-2">
          {isInscription || isTournament ? null : (
            <div className="flex -space-x-2">
              {Array.from({length: Math.min(game.players, 3)}).map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs">
                  <Users className="w-3 h-3"/>
                </div>
              ))}
              {game.players > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs">
                  <Plus className="w-3 h-3"/>{game.players - 3}
                </div>
              )}
            </div>
          )}

          <Button asChild className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90">
             <Link href={`/play/${game.id}`}>{isInscription ? "S'inscrire" : (isTournament ? "Observer" : "Rejoindre")}</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

interface FilterSidebarProps {
  activeType: string;
  setActiveType: (id: string) => void;
  activeFormats: string[];
  setActiveFormats: (formats: string[]) => void;
  resetFilters: () => void;
  setOpenCreateGame: (open: boolean) => void;
  setOpenAiTools: (open: boolean) => void;
}


function FilterSidebar({ activeType, setActiveType, activeFormats, setActiveFormats, resetFilters, setOpenCreateGame, setOpenAiTools }: FilterSidebarProps) {
  
  const handleFormatChange = (checked: boolean | string, format: string) => {
    if (checked) {
      setActiveFormats([...activeFormats, format]);
    } else {
      setActiveFormats(activeFormats.filter((f) => f !== format));
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-card p-4 rounded-lg flex-shrink-0 self-start space-y-6">
      
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">TYPE DE JEU</h3>
        <div className="space-y-1">
          {gameTypes.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveType(id)}
              className={`w-full flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors ${
                activeType === id ? 'bg-accent text-foreground' : 'hover:bg-accent/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">FORMAT</h3>
        <div className="space-y-3">
            {gameFormats.map(({id, name, format}) => (
                 <div key={id} className="flex items-center space-x-2">
                    <Checkbox id={id} checked={activeFormats.includes(format)} onCheckedChange={(checked) => handleFormatChange(checked, format)} />
                    <Label htmlFor={id} className="font-medium">{name}</Label>
                </div>
            ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>

      <Separator />

      <div className="space-y-2">
        <Button size="lg" className="w-full font-bold" onClick={() => setOpenCreateGame(true)}>
            <Gamepad2 className="mr-2"/>
            Créer une table
        </Button>
        <Button size="lg" variant="outline" className="w-full font-bold" onClick={() => setOpenAiTools(true)}>
            <Wand2 className="mr-2"/>
            Outils IA
        </Button>
      </div>
    </aside>
  );
}


export default function LobbyPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openAiTools, setOpenAiTools] = useState(false);

  const [activeStake, setActiveStake] = useState("Tous");
  const [activeType, setActiveType] = useState('all');
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const gamesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pokerGames') as Query<Game>;
  }, [firestore]);

  const { data: games, isLoading: gamesLoading } = useCollection<Game>(gamesQuery);

  const resetFilters = () => {
    setActiveStake("Tous");
    setActiveType("all");
    setActiveFormats([]);
  }

  const filteredGames = useMemo(() => {
    if (!games) return [];
    let tempGames = [...games];

    if (activeType !== 'all') {
      tempGames = tempGames.filter(game => game.gameVariant === activeType);
    }

    if (activeFormats.length > 0) {
        tempGames = tempGames.filter(game => activeFormats.includes(game.gameFormat));
    }
    
    if (activeStake !== 'Tous') {
      tempGames = tempGames.filter(g => {
        const stakeUpper = parseInt(g.stakes.split('/')[1]?.replace(' Ar', ''));
        if (isNaN(stakeUpper)) return false; 
        
        switch (activeStake) {
          case 'Micro': return stakeUpper <= 50;
          case 'Basse': return stakeUpper > 50 && stakeUpper <= 500;
          case 'Moyenne': return stakeUpper > 500 && stakeUpper <= 5000;
          case 'Haute': return stakeUpper > 5000;
          default: return true;
        }
      });
    }

    return tempGames;
  }, [games, activeType, activeFormats, activeStake]);

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
      <Dialog open={openCreateGame} onOpenChange={setOpenCreateGame}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Créer une nouvelle table</DialogTitle>
            </DialogHeader>
            <CreateGameForm setOpen={setOpenCreateGame} />
        </DialogContent>
      </Dialog>
      <Dialog open={openAiTools} onOpenChange={setOpenAiTools}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Outils d'aide IA</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <AIVariantSuggester />
                <AIOpponentGame />
            </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar 
          activeType={activeType}
          setActiveType={setActiveType}
          activeFormats={activeFormats}
          setActiveFormats={setActiveFormats}
          resetFilters={resetFilters}
          setOpenCreateGame={setOpenCreateGame}
          setOpenAiTools={setOpenAiTools}
        />
        <div className="flex-1">
          {/* Featured Event */}
          <div className="bg-gradient-to-br from-red-900/50 via-background to-background p-6 rounded-lg mb-8 relative overflow-hidden border border-red-500/20">
              <div className="flex gap-2 mb-2">
                <span className="text-xs font-bold uppercase bg-primary text-primary-foreground px-2 py-1 rounded">Événement</span>
                <span className="text-xs font-bold uppercase bg-muted text-muted-foreground px-2 py-1 rounded">Dimanche</span>
              </div>
              <h2 className="text-3xl font-black mb-2 text-white">Spécial Dimanche - 1M Ar Garantis</h2>
              <p className="text-muted-foreground max-w-lg mb-4">Rejoignez le plus grand tournoi de Madagascar. Qualifiez-vous dès maintenant via nos satellites à partir de 500 Ar.</p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link href="#">
                  S'inscrire <ArrowRight className="ml-2 w-4 h-4"/>
                </Link>
              </Button>
               <div className="absolute -right-10 -bottom-10 opacity-10">
                  <Spade size={150} className="text-primary" />
              </div>
          </div>
          
          {/* Game Tables */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
               {stakeLevels.map(level => (
                 <Button key={level} variant={activeStake === level ? 'default' : 'outline'} size="sm" onClick={() => setActiveStake(level)}>
                   {level}
                 </Button>
               ))}
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {gamesLoading ? (
                  Array.from({length: 6}).map((_, i) => (
                    <Card key={i} className="p-4 space-y-4 bg-card/80 border-border animate-pulse">
                      <div className="h-24 bg-muted rounded-md"></div>
                    </Card>
                  ))
                ) : filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))
                ) : (
                    <div className="text-center py-16 text-muted-foreground md:col-span-2 xl:col-span-3">
                        <p>Aucun jeu ne correspond à vos filtres.</p>
                        <p className="text-sm">Essayez d'en créer un nouveau !</p>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    