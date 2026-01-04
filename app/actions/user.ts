'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export const UserUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword.length > 0 && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: "New password must be at least 6 characters",
  path: ["newPassword"]
});

export type UserUpdateState = {
  success?: string
  error?: string
}

export async function updateProfile(data: z.infer<typeof UserUpdateSchema>): Promise<UserUpdateState> {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        return { error: "Unauthorized" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return { error: "User not found" };

        const updateData: any = {
            name: data.name,
            phone: data.phone
        };

        if (data.newPassword && data.newPassword.length > 0) {
            // If user has a password, verify current password
            if (user.password) {
                if (!data.currentPassword) {
                    return { error: "Current password is required to set a new password" };
                }
                const isValid = await bcrypt.compare(data.currentPassword, user.password);
                if (!isValid) {
                    return { error: "Incorrect current password" };
                }
            }
            
            updateData.password = await bcrypt.hash(data.newPassword, 10);
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: updateData
        });

        revalidatePath("/dashboard");
        return { success: "Profile updated successfully" };
    } catch (e) {
        console.error("Profile update error:", e);
        return { error: "Failed to update profile" };
    }
}
