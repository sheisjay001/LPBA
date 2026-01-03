import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete related records first if necessary (Cascade is usually handled by Prisma/DB, 
    // but explicit deletion ensures data integrity if cascade isn't set up)
    // For now, we assume relations (Assessments, Applications, Payments) might have cascade or we rely on Prisma.
    // However, explicit deletion is safer if relations are required.
    // Let's rely on Prisma's onDelete: Cascade if defined, or we might get an error.
    // Looking at schema.prisma, there are no explicit onDelete actions, so we might need to delete related data.
    
    // Let's try deleting the user directly. If it fails due to FK constraints, we'll know.
    // Actually, let's play it safe and delete related data manually in transaction.
    
    await prisma.$transaction([
        prisma.leadLog.deleteMany({ where: { userId: id } }),
        prisma.assessment.deleteMany({ where: { userId: id } }),
        prisma.application.deleteMany({ where: { userId: id } }),
        prisma.payment.deleteMany({ where: { userId: id } }),
        prisma.user.delete({ where: { id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
