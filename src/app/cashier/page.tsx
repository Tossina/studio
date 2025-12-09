'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, writeBatch, serverTimestamp, increment } from "firebase/firestore";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DepositSchema = z.object({
  amount: z.coerce.number().positive({ message: "Le montant doit être positif." }),
  paymentMethod: z.string({ required_error: "Veuillez sélectionner un moyen de paiement." }),
});

const WithdrawSchema = z.object({
  amount: z.coerce.number().positive({ message: "Le montant doit être positif." }),
  withdrawMethod: z.string({ required_error: "Veuillez sélectionner un moyen de retrait." }),
  accountDetails: z.string().min(1, { message: "Les détails du compte sont requis." }),
});

type DepositFormValues = z.infer<typeof DepositSchema>;
type WithdrawFormValues = z.infer<typeof WithdrawSchema>;

export default function CashierPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ balance: number }>(userProfileRef);

  const depositForm = useForm<DepositFormValues>({
    resolver: zodResolver(DepositSchema),
    defaultValues: { amount: 50000 },
  });

  const withdrawForm = useForm<WithdrawFormValues>({
    resolver: zodResolver(WithdrawSchema),
    defaultValues: { amount: 10000, accountDetails: "" },
  });
  
  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleTransaction = async (
    amount: number,
    type: 'deposit' | 'withdrawal',
    method: string,
    details?: string
  ) => {
    if (!firestore || !user) return;
    
    withdrawForm.formState.isSubmitting || depositForm.formState.isSubmitting;

    if (type === 'withdrawal' && userProfile && userProfile.balance < amount) {
        toast({
            variant: "destructive",
            title: "Solde insuffisant",
            description: "Votre solde est insuffisant pour effectuer ce retrait.",
        });
        return;
    }

    const batch = writeBatch(firestore);
    const userRef = doc(firestore, "users", user.uid);
    const transactionRef = doc(collection(firestore, `users/${user.uid}/transactions`));

    const newTransaction = {
      userId: user.uid,
      transactionDate: serverTimestamp(),
      transactionType: type,
      amount: amount,
      paymentMethod: method,
      status: "completed",
      ...(details && { accountDetails: details }),
    };

    batch.set(transactionRef, newTransaction);
    batch.update(userRef, {
      balance: increment(type === 'deposit' ? amount : -amount),
    });

    try {
      await batch.commit();
      toast({
        title: `Transaction réussie !`,
        description: `Votre ${type === 'deposit' ? 'dépôt' : 'retrait'} de ${amount} Ar a été effectué.`,
      });
      depositForm.reset();
      withdrawForm.reset();
    } catch (error) {
      console.error("Erreur de transaction :", error);
      toast({
        variant: "destructive",
        title: "Erreur de transaction",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  const onDepositSubmit: SubmitHandler<DepositFormValues> = async (data) => {
    await handleTransaction(data.amount, 'deposit', data.paymentMethod);
  };

  const onWithdrawSubmit: SubmitHandler<WithdrawFormValues> = async (data) => {
    await handleTransaction(data.amount, 'withdrawal', data.withdrawMethod, data.accountDetails);
  };
  
  const balance = userProfile?.balance ?? 0;
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Tabs defaultValue="deposit" className="w-full max-w-xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Dépôt</TabsTrigger>
          <TabsTrigger value="withdraw">Retrait</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <Card>
            <Form {...depositForm}>
              <form onSubmit={depositForm.handleSubmit(onDepositSubmit)}>
                <CardHeader>
                  <CardTitle>Effectuer un dépôt</CardTitle>
                  <CardDescription>
                    Ajoutez des fonds à votre compte. Votre solde actuel est de {balance.toLocaleString('fr-FR')} Ar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={depositForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="deposit-amount">Montant (Ar)</Label>
                        <FormControl>
                          <Input id="deposit-amount" placeholder="ex: 50000" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={depositForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="payment-method">Moyen de paiement</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="payment-method">
                              <SelectValue placeholder="Sélectionnez une méthode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mvola">Mvola</SelectItem>
                            <SelectItem value="OrangeMoney">Orange Money</SelectItem>
                            <SelectItem value="AirtelMoney">Airtel Money</SelectItem>
                            <SelectItem value="Carte">Carte de crédit/débit</SelectItem>
                            <SelectItem value="Virement">Virement bancaire</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={depositForm.formState.isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {depositForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                    Procéder au dépôt
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="withdraw">
          <Card>
            <Form {...withdrawForm}>
              <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)}>
                <CardHeader>
                  <CardTitle>Demander un retrait</CardTitle>
                  <CardDescription>
                    Retirez des fonds de votre compte. Disponible pour retrait : {balance.toLocaleString('fr-FR')} Ar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={withdrawForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="withdraw-amount">Montant (Ar)</Label>
                        <FormControl>
                          <Input id="withdraw-amount" placeholder="ex: 100000" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={withdrawForm.control}
                    name="withdrawMethod"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="withdraw-method">Moyen de retrait</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="withdraw-method">
                              <SelectValue placeholder="Sélectionnez une méthode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mvola">Mvola</SelectItem>
                            <SelectItem value="OrangeMoney">Orange Money</SelectItem>
                            <SelectItem value="AirtelMoney">Airtel Money</SelectItem>
                            <SelectItem value="Virement">Virement bancaire</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={withdrawForm.control}
                    name="accountDetails"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="account-details">Détails du compte</Label>
                        <FormControl>
                          <Input id="account-details" placeholder="ex: Numéro de téléphone ou Compte bancaire" {...field} />
FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={withdrawForm.formState.isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                     {withdrawForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Landmark className="mr-2 h-4 w-4" />}
                    Demander le retrait
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
