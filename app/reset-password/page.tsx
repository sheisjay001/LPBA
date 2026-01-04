"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      
      if (res.ok) {
          setMessage("Password reset successfully!");
          toast.success("Password reset successfully!");
          setTimeout(() => router.push("/login"), 2000);
      } else {
          toast.error(data.error || "Failed to reset password. Link may be expired.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
      return (
          <div className="text-center space-y-4">
              <div className="rounded-md bg-red-50 p-4 text-red-600 font-medium border border-red-200">
                Invalid or missing reset token.
              </div>
              <Button asChild className="w-full font-semibold" variant="outline">
                  <Link href="/login">Return to Login</Link>
              </Button>
          </div>
      );
  }

  return (
      <>
          {message ? (
              <div className="text-center space-y-4">
                  <div className="rounded-md bg-green-50 p-4 text-green-600 font-medium border border-green-200">
                    {message}
                  </div>
                  <p className="text-sm text-muted-foreground">Redirecting to login...</p>
              </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="bg-white"
                    />
                </div>
                
                <Button type="submit" className="w-full font-semibold" disabled={loading}>
                {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Resetting...
                    </span>
                ) : "Set New Password"}
                </Button>
            </form>
          )}
      </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription>Choose a new secure password.</CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
