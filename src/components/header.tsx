'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem, Globe, LogOut } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gem className="h-8 w-8 text-primary" />
          <span className="font-bold sm:inline-block font-black text-2xl tracking-tighter">
            DagoPoker
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm ml-auto">
          {user && (
             <Link
                href="/lobby"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Lobby
              </Link>
          )}
          <Link
            href="#"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Règles du jeu
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Tournois
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Support
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5"/>
                <span className="sr-only">Changer de langue</span>
            </Button>
            <span className="text-foreground/40">FR</span>

            {isUserLoading ? (
              <div className="w-24 h-10 bg-muted rounded-md animate-pulse" />
            ) : user ? (
              <>
                 <Button asChild variant="secondary">
                  <Link href="/cashier">Caisse</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <Avatar className="h-9 w-9">
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
