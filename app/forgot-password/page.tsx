"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
          setMessage(data.message || "Check your email for the reset link.");
          toast.success("Reset link sent to your email.");
      } else {
          toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
              <div className="text-center space-y-4">
                  <div className="rounded-md bg-green-50 p-4 text-green-600 font-medium border border-green-200">
                    {message}
                  </div>
                  <Button asChild className="w-full font-semibold" variant="outline">
                      <Link href="/login">Back to Login</Link>
                  </Button>
              </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="bg-white"
                />
                </div>
                
                <Button type="submit" className="w-full font-semibold" disabled={loading}>
                {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending Link...
                    </span>
                ) : "Send Reset Link"}
                </Button>
                
                <div className="text-center mt-4">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Back to Login
                    </Link>
                </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
