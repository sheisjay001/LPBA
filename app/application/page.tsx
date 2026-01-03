"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplicationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    experience: "",
    goals: "",
    commitment: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, program: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle className="text-green-600">Application Received</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Thank you for applying to LPBA Consulting's physical programs. Our team will review your application and contact you shortly.
            </p>
            <p className="text-sm text-gray-500">
                You can now access your dashboard to track your status.
            </p>
            <p className="text-xs text-gray-400 mt-2">Default password: <strong>user123</strong></p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => window.location.href = "/login"}>Login to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>LPBA Physical Program Application</CardTitle>
          <CardDescription>
            Apply for our exclusive physical cohorts. Please provide detailed answers to help us assess your fit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234..." />
          </div>

          <div className="space-y-2">
            <Label>Select Program</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Group Intensive">Group Intensive (₦500,000)</SelectItem>
                <SelectItem value="Private Executive">Private / Executive (₦1,500,000)</SelectItem>
                <SelectItem value="Elite Advisory">Elite / Strategic Advisory (₦5,000,000)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Briefly describe your business or career experience.</Label>
            <Textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="I have been running..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">What are your top 3 goals for this program?</Label>
            <Textarea id="goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="1. Scale revenue..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commitment">Are you ready to commit the time and financial resources required?</Label>
            <Input id="commitment" name="commitment" value={formData.commitment} onChange={handleChange} placeholder="Yes, I am ready..." />
          </div>

        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
