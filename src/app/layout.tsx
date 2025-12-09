import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'DagoPoker',
  description: 'Online Poker Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="w-full py-8 border-t border-border/40">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              <p>© 2024 DagoPoker. Tous droits réservés. Jouer comporte des risques : endettement, isolement, dépendance.</p>
              <div className="flex justify-center gap-4 mt-4">
                <Link href="#" className="hover:text-foreground">Conditions Générales</Link>
                <Link href="#" className="hover:text-foreground">Politique de Confidentialité</Link>
                <Link href="#" className="hover:text-foreground">Jeu Responsable</Link>
              </div>
            </div>
          </footer>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
