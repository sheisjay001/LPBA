import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
