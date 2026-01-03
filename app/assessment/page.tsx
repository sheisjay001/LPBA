"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    q1: "",
    q2: "",
    q3: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Convert answers to score-able format if needed
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      answers: {
        q1: parseInt(formData.q1) || 0,
        q2: parseInt(formData.q2) || 0,
        q3: parseInt(formData.q3) || 0,
      }
    };

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setStep(3); // Result step
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>LPBA Assessment</CardTitle>
          <CardDescription>
            Step {step} of 3
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234..." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
               <div className="space-y-2">
                <Label>1. How would you rate your current leadership influence? (1-5)</Label>
                <Select onValueChange={(v) => handleSelectChange("q1", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>2. What is your current monthly revenue?</Label>
                <Select onValueChange={(v) => handleSelectChange("q2", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Less than ₦100k</SelectItem>
                    <SelectItem value="3">₦100k - ₦1M</SelectItem>
                    <SelectItem value="5">₦1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               <div className="space-y-2">
                <Label>3. How clear are you on your life's purpose?</Label>
                <Select onValueChange={(v) => handleSelectChange("q3", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Not clear</SelectItem>
                    <SelectItem value="3">Somewhat clear</SelectItem>
                    <SelectItem value="5">Very clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && result && (
             <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold">Your Results Are In!</h3>
                <p>Category: <span className="font-semibold text-primary">{result.result}</span></p>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium">Recommended Next Step:</p>
                  <p className="text-lg font-bold text-green-700">{result.recommendation}</p>
                </div>
                <p className="text-sm text-gray-500">Your account has been created.</p>
                <p className="text-xs text-gray-400">Please login with your email and default password: <strong>user123</strong></p>
             </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 1 && (
            <Button className="w-full" onClick={() => setStep(2)}>Next</Button>
          )}
          {step === 2 && (
             <div className="flex gap-2 w-full">
               <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
               <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                 {loading ? "Analyzing..." : "Submit Assessment"}
               </Button>
             </div>
          )}
          {step === 3 && (
            <Button className="w-full" onClick={() => window.location.href = "/login"}>Login to Dashboard</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
