"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { UserUpdateSchema, updateProfile } from "@/app/actions/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

type FormData = z.infer<typeof UserUpdateSchema>

interface SettingsFormProps {
    user: {
        name?: string | null
        email?: string | null
        phone?: string | null
    }
}

export function SettingsForm({ user }: SettingsFormProps) {
    const [loading, setLoading] = useState(false)
    
    const form = useForm<FormData>({
        resolver: zodResolver(UserUpdateSchema),
        defaultValues: {
            name: user.name || "",
            phone: user.phone || "",
            currentPassword: "",
            newPassword: "",
        }
    })

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        try {
            const result = await updateProfile(data)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Profile updated successfully")
                // Reset password fields
                form.reset({
                    name: data.name,
                    phone: data.phone,
                    currentPassword: "",
                    newPassword: ""
                }, { keepValues: true }) // Keep name/phone, clear passwords (manual below)
                form.setValue("currentPassword", "")
                form.setValue("newPassword", "")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-none shadow-lg">
            <CardHeader>
                <CardTitle className="font-serif text-2xl">Profile Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user.email || ""} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                {...form.register("name")} 
                                placeholder="Your name"
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                                id="phone" 
                                {...form.register("phone")} 
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-6 mt-4">
                        <h3 className="text-lg font-medium mb-4 font-serif">Security</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input 
                                    id="currentPassword" 
                                    type="password"
                                    {...form.register("currentPassword")} 
                                    placeholder="********"
                                />
                                <p className="text-xs text-muted-foreground">Required only if you want to change your password.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input 
                                    id="newPassword" 
                                    type="password"
                                    {...form.register("newPassword")} 
                                    placeholder="********"
                                />
                                {form.formState.errors.newPassword && (
                                    <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
