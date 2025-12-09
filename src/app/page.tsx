'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Eye, EyeOff, Landmark, Lock, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";


export default function Home() {
  const [passwordVisible, setPasswordVisible] = useState(false);

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
                        <form className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="phone">NUMÉRO DE TÉLÉPHONE</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="phone" type="tel" placeholder="ex: 034 00 000 00" required className="pl-10"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">MOT DE PASSE</Label>
                                    <Link href="#" className="text-sm text-primary hover:underline">Oublié ?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="password" type={passwordVisible ? "text" : "password"} required className="pl-10 pr-10" />
                                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {passwordVisible ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Checkbox id="remember-me" />
                                <Label htmlFor="remember-me" className="ml-2 font-normal text-muted-foreground">Se souvenir de moi</Label>
                            </div>
                            <Button className="w-full !mt-6 bg-primary text-primary-foreground text-lg font-bold h-12 group">
                                Jouer maintenant <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"/>
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
                            <h2 className="text-2xl font-bold">Créer un compte</h2>
                            <p className="text-muted-foreground">Rejoignez-nous aujourd'hui !</p>
                        </div>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-phone">NUMÉRO DE TÉLÉPHONE</Label>
                                <Input id="signup-phone" type="tel" placeholder="ex: 034 00 000 00" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="signup-password">MOT DE PASSE</Label>
                                <Input id="signup-password" type="password" required />
                            </div>
                            <Button className="w-full !mt-6 bg-primary text-primary-foreground text-lg font-bold h-12 group">
                                S'inscrire <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"/>
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
