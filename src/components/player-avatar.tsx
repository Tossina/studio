import { type Player } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
  player: Player;
}

export function PlayerAvatar({ player }: PlayerAvatarProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 relative w-24 transition-all duration-300", player.isTurn ? 'scale-110' : 'opacity-80')}>
        {player.isTurn && <div className="absolute -inset-2 border-2 border-primary rounded-full animate-pulse"></div>}
      <Avatar className="h-16 w-16 border-2 border-border">
        <AvatarImage src={player.avatarUrl} alt={player.name} />
        <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="text-center bg-card/80 px-2 py-1 rounded-md w-full">
        <p className="font-semibold text-sm truncate">{player.name}</p>
        <p className="text-primary font-bold text-xs">${player.stack.toLocaleString()}</p>
      </div>
      {player.isDealer && (
        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black w-6 h-6 flex items-center justify-center p-0">D</Badge>
      )}
       {player.action && player.betAmount > 0 && (
        <div className="absolute -bottom-6">
            <Badge variant="secondary">${player.betAmount}</Badge>
        </div>
      )}
    </div>
  );
}
