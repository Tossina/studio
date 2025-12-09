'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem, LogOut, Search, Wallet } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur border-b border-border/40">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gem className="h-8 w-8 text-primary" />
          <span className="font-black text-2xl tracking-tighter">
            DagoPoker
          </span>
        </Link>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Chercher une table..." className="pl-10 bg-input border-border focus:bg-background" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm ml-10">
            <Link
                href="/lobby"
                className="transition-colors text-primary font-semibold border-b-2 border-primary pb-1"
              >
                Lobby
              </Link>
            <Link
              href="#"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Tournois
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Cash Game
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Promotions
            </Link>
        </nav>
        </div>


        <div className="flex flex-1 items-center justify-end gap-3">
            {isUserLoading ? (
              <div className="w-48 h-10 bg-muted rounded-md animate-pulse" />
            ) : user ? (
              <>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">SOLDE</p>
                    <p className="font-bold text-lg">250 000 Ar</p>
                </div>
                 <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Link href="/cashier"><Wallet className="mr-2 h-4 w-4" /> Dépôt</Link>
                </Button>
                
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="ghost" size="icon" aria-label="Sign out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/">
                  S'inscrire
                </Link>
              </Button>
            )}
        </div>
      </div>
    </header>
  );
}
