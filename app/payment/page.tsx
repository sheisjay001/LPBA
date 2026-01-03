"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PaystackButton } from "react-paystack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function PaymentForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const amountParam = searchParams.get("amount");
  
  const [amount, setAmount] = useState(amountParam || "");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  
  // Paystack expects amount in kobo
  const amountInKobo = (parseInt(amount) || 0) * 100;

  const componentProps = {
    email,
    amount: amountInKobo,
    metadata: {
      name,
      phone,
      plan,
    },
    publicKey,
    text: "Pay Now",
    onSuccess: () => alert("Thanks for doing business with us! Come back soon!!"),
    onClose: () => alert("Wait! You need this oil, don't go!!!!"),
  };

  const isFormValid = email && amount && name && phone;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
        <CardDescription>Complete your enrollment for {plan || "the program"}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="08012345678" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input 
            id="amount" 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            disabled={!!amountParam}
          />
        </div>
      </CardContent>
      <CardFooter>
        {isFormValid ? (
          <div className="w-full">
             {/* We use a div wrapper because PaystackButton might not accept className directly or behave as a Shadcn Button */}
             <PaystackButton 
                {...componentProps} 
                className="w-full h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              />
          </div>
        ) : (
          <Button className="w-full" disabled>
            Fill all details to Pay
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<div>Loading payment...</div>}>
        <PaymentForm />
      </Suspense>
    </div>
  );
}
