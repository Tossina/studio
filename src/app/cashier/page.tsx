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
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Make a Deposit</CardTitle>
              <CardDescription>
                Add funds to your account. Your current balance is $1,250.00.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (USD)</Label>
                <Input id="deposit-amount" placeholder="e.g., 50.00" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mvola">Mvola</SelectItem>
                    <SelectItem value="orangemoney">Orange Money</SelectItem>
                    <SelectItem value="airtelmoney">Airtel Money</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Deposit
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Request a Withdrawal</CardTitle>
              <CardDescription>
                Withdraw funds from your account. Available for withdrawal: $1,250.00.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                <Input id="withdraw-amount" placeholder="e.g., 100.00" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                <Select>
                  <SelectTrigger id="withdraw-method">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="mvola">Mvola</SelectItem>
                    <SelectItem value="orangemoney">Orange Money</SelectItem>
                    <SelectItem value="airtelmoney">Airtel Money</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="account-details">Account Details</Label>
                 <Input id="account-details" placeholder="e.g., Phone number or Bank account" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Landmark className="mr-2 h-4 w-4" />
                Request Withdrawal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
