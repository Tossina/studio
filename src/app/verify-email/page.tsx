'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, Loader2 } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmailPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        // If no user is logged in, redirect to home page to log in or sign up
        router.push('/');
      } else if (user.emailVerified) {
        // If user is already verified, redirect to lobby
        router.push('/lobby');
      }
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);
  
  // Periodically reload user to check for verification status
   useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          router.push('/lobby');
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [user, router]);


  const handleResendVerification = async () => {
    if (!user || timer > 0) return;

    setIsResending(true);
    setResendMessage('');
    try {
      await sendEmailVerification(user);
      setResendMessage('Un nouveau lien a été envoyé !');
      setTimer(60); // Reset timer
    } catch (error) {
      setResendMessage("Échec de l'envoi de l'e-mail. Veuillez réessayer.");
      console.error('Error resending verification email:', error);
    }
    setIsResending(false);
  };
  
  const handleSignOut = () => {
    auth.signOut();
    router.push('/');
  }

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <MailCheck className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="mt-4">Vérifiez votre adresse e-mail</CardTitle>
          <CardDescription>
            Un e-mail de vérification a été envoyé à <br/>
            <span className="font-bold text-foreground">{user.email}</span>.
            <br/>
            Veuillez cliquer sur le lien dans cet e-mail pour continuer.
          </d_CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button
                onClick={handleResendVerification}
                disabled={isResending || timer > 0}
                className="w-full"
            >
                {isResending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    `Renvoyer le lien ${timer > 0 ? `(${timer}s)` : ''}`
                )}
            </Button>
            {resendMessage && <p className="text-sm text-muted-foreground">{resendMessage}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <p className="text-xs text-muted-foreground">
                Vous n'avez pas reçu l'email ? Vérifiez votre dossier de spam.
            </p>
            <Button variant="link" onClick={handleSignOut}>Se déconnecter</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
