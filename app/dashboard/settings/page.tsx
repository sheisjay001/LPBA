import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) redirect("/login")

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground hover:text-primary">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-serif text-primary">Settings</h1>
                        <p className="text-muted-foreground">Manage your profile and security</p>
                    </div>
                </div>
                
                <SettingsForm user={{
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }} />
            </div>
        </div>
    )
}
