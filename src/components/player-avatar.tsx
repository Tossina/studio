import { type Player } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
  player: Player;
}

export function PlayerAvatar({ player }: PlayerAvatarProps) {

  const getActionText = () => {
    if (player.action === 'fold') return 'Fold';
    if (player.isTurn) return 'Thinking...';
    if (player.action) return `${player.action.charAt(0).toUpperCase() + player.action.slice(1)} ${player.betAmount > 0 ? player.betAmount : ''}`.trim();
    return null;
  }
  
  const actionText = getActionText();

  return (
    <div className={cn(
        "flex flex-col items-center gap-1.5 relative w-28 transition-all duration-300 group",
        player.action === 'fold' ? 'opacity-40' : 'opacity-100',
      )}>
      
      <div className="relative">
        <Avatar className={cn("h-16 w-16 bg-muted", player.isTurn ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'ring-2 ring-border')}>
          <AvatarImage src={player.avatarUrl} alt={player.name} />
          <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        {player.isDealer && (
          <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black w-6 h-6 flex items-center justify-center p-0 text-xs font-bold">D</Badge>
        )}
      </div>

      <div className="text-center bg-black/50 px-3 py-1.5 rounded-md w-full relative -mt-2">
        <p className="font-semibold text-sm truncate text-white">{player.name}</p>
        <p className="text-amber-400 font-bold text-xs">{player.stack.toLocaleString('fr-FR')} Ar</p>
      </div>

       {actionText && (
        <Badge variant="secondary" className="absolute top-[calc(100%+4px)] whitespace-nowrap">
           {actionText}
        </Badge>
      )}

      {player.betAmount > 0 && player.action !== 'fold' && (
        <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-red-600 animate-pulse"></div>
            <p className="text-xs font-bold text-white">{player.betAmount}</p>
        </div>
      )}
    </div>
  );
}
