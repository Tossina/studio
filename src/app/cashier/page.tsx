import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark } from "lucide-react";

export default function CashierPage() {
  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Tabs defaultValue="deposit" className="w-full max-w-xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Dépôt</TabsTrigger>
          <TabsTrigger value="withdraw">Retrait</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Effectuer un dépôt</CardTitle>
              <CardDescription>
                Ajoutez des fonds à votre compte. Votre solde actuel est de 1 250,00 Ar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Montant (Ar)</Label>
                <Input id="deposit-amount" placeholder="ex: 50000" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Moyen de paiement</Label>
                <Select>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mvola">Mvola</SelectItem>
                    <SelectItem value="orangemoney">Orange Money</SelectItem>
                    <SelectItem value="airtelmoney">Airtel Money</SelectItem>
                    <SelectItem value="card">Carte de crédit/débit</SelectItem>
                    <SelectItem value="bank">Virement bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <CreditCard className="mr-2 h-4 w-4" />
                Procéder au dépôt
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Demander un retrait</CardTitle>
              <CardDescription>
                Retirez des fonds de votre compte. Disponible pour retrait : 1 250,00 Ar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Montant (Ar)</Label>
                <Input id="withdraw-amount" placeholder="ex: 100000" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdraw-method">Moyen de retrait</Label>
                <Select>
                  <SelectTrigger id="withdraw-method">
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="mvola">Mvola</SelectItem>
                    <SelectItem value="orangemoney">Orange Money</SelectItem>
                    <SelectItem value="airtelmoney">Airtel Money</SelectItem>
                    <SelectItem value="bank">Virement bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="account-details">Détails du compte</Label>
                 <Input id="account-details" placeholder="ex: Numéro de téléphone ou Compte bancaire" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Landmark className="mr-2 h-4 w-4" />
                Demander le retrait
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
