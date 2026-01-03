import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
        totalLeads,
        leadsByState,
        totalApplications,
        applicationsByStatus,
        applicationsByScore
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'LEAD' } }),
        prisma.user.groupBy({
            by: ['state'],
            _count: { state: true },
            where: { role: 'LEAD' }
        }),
        prisma.application.count(),
        prisma.application.groupBy({
            by: ['status'],
            _count: { status: true }
        }),
        prisma.application.groupBy({
            by: ['score'],
            _count: { score: true }
        })
    ]);

    return NextResponse.json({
        totalLeads,
        leadsByState,
        totalApplications,
        applicationsByStatus,
        applicationsByScore
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
