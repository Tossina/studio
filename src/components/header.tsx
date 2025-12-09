import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem, Globe } from "lucide-react";

export function Header() {
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
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <Link href="/signup">
                S'inscrire
              </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
