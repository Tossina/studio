'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Eye, EyeOff, Landmark, Lock, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, useUser, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { Loader2 } from "lucide-react";
import { User, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const LoginSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

const SignupSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[a-z]/, { message: "Doit contenir au moins une minuscule" })
    .regex(/[A-Z]/, { message: "Doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { message: "Doit contenir au moins un chiffre" })
    .regex(/[^a-zA-Z0-9]/, { message: "Doit contenir au moins un caractère spécial" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});


type LoginInputs = z.infer<typeof LoginSchema>;
type SignupInputs = z.infer<typeof SignupSchema>;


export default function Home() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<Omit<SignupInputs, 'password' | 'confirmPassword'> | null>(null);

  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors } } = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const { register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: signupErrors } } = useForm<SignupInputs>({
    resolver: zodResolver(SignupSchema),
  });
  
  useEffect(() => {
    if (user && !isUserLoading) {
      if (user.emailVerified) {
        router.push('/lobby');
      } else {
        router.push('/verify-email');
      }
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
        if (newUser && pendingSignupData) {
            const { firestore } = initializeFirebase();
            const userRef = doc(firestore, "users", newUser.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                const userProfile = {
                    id: newUser.uid,
                    username: pendingSignupData.username,
                    email: newUser.email,
                    registrationDate: new Date().toISOString(),
                    balance: 0, // Starting balance
                };
                await setDocumentNonBlocking(userRef, userProfile);
                await sendEmailVerification(newUser);
            }
            setPendingSignupData(null); 
            setAuthLoading(false);
            setAuthError(null);
            router.push('/verify-email');
        } else if (newUser) {
            setAuthLoading(false);
            setAuthError(null);
             if (newUser.emailVerified) {
                router.push('/lobby');
            }
        } else {
             setAuthLoading(false);
        }
    }, (error) => {
        setAuthLoading(false);
        // Map Firebase error codes to user-friendly messages
        switch (error.code) {
            case 'auth/email-already-in-use':
                setAuthError("Cette adresse e-mail est déjà utilisée par un autre compte.");
                break;
            case 'auth/wrong-password':
                setAuthError("Mot de passe incorrect. Veuillez réessayer.");
                break;
            case 'auth/user-not-found':
                setAuthError("Aucun compte trouvé avec cette adresse e-mail.");
                break;
            default:
                setAuthError("Une erreur d'authentification est survenue. Veuillez réessayer.");
                break;
        }
    });

    return () => unsubscribe();
  }, [auth, pendingSignupData, router]);

  const onLogin: SubmitHandler<LoginInputs> = (data) => {
    if (!auth) return;
    setAuthLoading(true);
    setAuthError(null);
    initiateEmailSignIn(auth, data.email, data.password);
  };

  const onSignup: SubmitHandler<SignupInputs> = (data) => {
    if (!auth) return;
    setAuthLoading(true);
    setAuthError(null);
    setPendingSignupData({ username: data.username, email: data.email });
    initiateEmailSignUp(auth, data.email, data.password);
  };

  if (isUserLoading || user) {
      return (
          <div className="flex-grow flex items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="flex-grow flex items-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                EN DIRECT DE TANA
              </div>
              <h1 className="text-5xl font-black tracking-tighter sm:text-6xl xl:text-7xl/none">
                Le Poker en Ligne <span className="text-primary">100% Gasy</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Rejoignez les tables les plus chaudes de Madagascar. Misez, bluffez et gagnez gros avec des paiements instantanés via vos solutions Mobile Money préférées.
              </p>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-card p-4">
                    <Landmark className="w-8 h-8 text-primary"/>
                    <div>
                        <h3 className="font-bold">Retraits</h3>
                        <p className="text-sm text-muted-foreground">Instantanés</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-card p-4">
                    <ShieldCheck className="w-8 h-8 text-primary"/>
                    <div>
                        <h3 className="font-bold">Sécurité</h3>
                        <p className="text-sm text-muted-foreground">100% Fiable</p>
                    </div>
                </div>
            </div>
          </div>

          <div>
             <Tabs defaultValue="connexion" className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-border">
                    <TabsTrigger value="connexion">Connexion</TabsTrigger>
                    <TabsTrigger value="inscription">Inscription</TabsTrigger>
                </TabsList>
                <TabsContent value="connexion">
                    <div className="bg-card p-6 md:p-8 rounded-b-lg border-x-2 border-b-2 border-border">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Bon retour parmi nous !</h2>
                            <p className="text-muted-foreground">Connectez-vous pour rejoindre une table.</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmitLogin(onLogin)}>
                            {authError && (
                                <Alert variant="destructive">
                                    <AlertTitle>Erreur de connexion</AlertTitle>
                                    <AlertDescription>{authError}</AlertDescription>
                                </Alert>
                            )}
                             <div className="space-y-2">
                                <Label htmlFor="login-email">ADRESSE E-MAIL</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="login-email" type="email" placeholder="ex: patrick@gmail.com" {...registerLogin("email")} className="pl-10"/>
                                </div>
                                {loginErrors.email && <p className="text-destructive text-sm">{loginErrors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="login-password">MOT DE PASSE</Label>
                                    <Link href="#" className="text-sm text-primary hover:underline">Oublié ?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="login-password" type={passwordVisible ? "text" : "password"} {...registerLogin("password")} className="pl-10 pr-10" />
                                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {passwordVisible ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>
                                {loginErrors.password && <p className="text-destructive text-sm">{loginErrors.password.message}</p>}
                            </div>
                            <div className="flex items-center">
                                <Checkbox id="remember-me" />
                                <Label htmlFor="remember-me" className="ml-2 font-normal text-muted-foreground">Se souvenir de moi</Label>
                            </div>
                            <Button type="submit" disabled={authLoading} className="w-full !mt-6 bg-primary text-primary-foreground text-lg font-bold h-12 group">
                                {authLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Jouer maintenant'}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"/>
                            </Button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">DÉPÔTS & RETRAITS VIA</p>
                            <div className="flex justify-center gap-2">
                                <Button variant="secondary" className="bg-input">MVola</Button>
                                <Button variant="secondary" className="bg-input">Orange</Button>
                                <Button variant="secondary" className="bg-input">Airtel</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="inscription">
                     <div className="bg-card p-8 rounded-b-lg border-x-2 border-b-2 border-border">
                       <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Créer un compte sécurisé</h2>
                            <p className="text-muted-foreground">Rejoignez-nous aujourd'hui ! C'est rapide et sûr.</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmitSignup(onSignup)}>
                             {authError && (
                                <Alert variant="destructive">
                                    <AlertTitle>Erreur d'inscription</AlertTitle>
                                    <AlertDescription>{authError}</AlertDescription>
                                </Alert>
                            )}
                             <div className="space-y-2">
                                <Label htmlFor="signup-username">NOM D'UTILISATEUR</Label>
                                 <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="signup-username" placeholder="ex: RaryGasy" {...registerSignup("username")} className="pl-10" />
                                </div>
                                {signupErrors.username && <p className="text-destructive text-sm">{signupErrors.username.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">ADRESSE E-MAIL</Label>
                                 <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="signup-email" type="email" placeholder="ex: patrick@gmail.com" {...registerSignup("email")} className="pl-10" />
                                </div>
                                {signupErrors.email && <p className="text-destructive text-sm">{signupErrors.email.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="signup-password">MOT DE PASSE</Label>
                                <div className="relative">
                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="signup-password" type={passwordVisible ? "text" : "password"} {...registerSignup("password")} className="pl-10 pr-10" />
                                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {passwordVisible ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>
                                {signupErrors.password && <p className="text-destructive text-sm">{signupErrors.password.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-confirm-password">CONFIRMER LE MOT DE PASSE</Label>
                                <div className="relative">
                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="signup-confirm-password" type={confirmPasswordVisible ? "text" : "password"} {...registerSignup("confirmPassword")} className="pl-10 pr-10" />
                                    <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {confirmPasswordVisible ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>
                                {signupErrors.confirmPassword && <p className="text-destructive text-sm">{signupErrors.confirmPassword.message}</p>}
                            </div>
                            <Button type="submit" disabled={authLoading} className="w-full !mt-6 bg-primary text-primary-foreground text-lg font-bold h-12 group">
                                {authLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Créer mon compte"}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"/>
                            </Button>
                        </form>
                    </div>
                </TabsContent>
            </Tabs>
          </div>

        </div>
      </div>
    </div>
  );
}
