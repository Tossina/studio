import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gem, LogOut, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Header() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline text-lg">
            DagoPoker
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/lobby"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Lobby
          </Link>
          <Link
            href="/cashier"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Cashier
          </Link>
          <Link
            href="/play/1"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Play
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Player Avatar" data-ai-hint="person portrait" />}
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">PlayerOne</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    player@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
