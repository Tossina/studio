import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-1");

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex-grow flex items-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            {heroImage && (
              <Image
                alt="Poker game in action"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint="poker cards"
                height={600}
                src={heroImage.imageUrl}
                width={600}
              />
            )}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  DagoPoker
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  The ultimate online poker experience. Join thousands of players in cash games, tournaments, and more.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/signup">
                    Join Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/login">
                    Player Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
