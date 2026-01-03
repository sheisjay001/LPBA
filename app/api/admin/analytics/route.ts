import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Leads per state
    const leadsPerState = await prisma.user.groupBy({
      by: ["state"],
      _count: {
        id: true,
      },
    });

    // 2. Online Program Conversion Rate
    // Formula: # of leads who paid for online program / # of leads who received online invitation (ONLINE_CLIENT)
    // For simplicity, we'll approximate "received online invitation" as anyone who reached ONLINE_CLIENT state or higher?
    // The prompt says: "Focus on automation-enabled or approved invitations."
    // Let's count users who are currently in 'ONLINE_CLIENT' or have passed through it.
    // However, the simplest interpretation is users currently in 'ONLINE_CLIENT' vs those who paid.
    // Better yet: Users who paid for 'online' / Users who are eligible (e.g. state = ONLINE_CLIENT)
    
    // Total users who have ever reached ONLINE_CLIENT is hard to track without full logs traversal.
    // Let's use current state snapshot for now as per prompt example query:
    // WHERE l.state = 'ONLINE_CLIENT' AND p.program_type = 'online' AND p.status = 'SUCCESS'
    
    // We need total eligible leads (denominator)
    const eligibleForOnline = await prisma.user.count({
        where: {
            state: "ONLINE_CLIENT" 
        }
    });

    // We need total paid (numerator)
    const paidOnline = await prisma.user.count({
        where: {
            payments: {
                some: {
                    programType: "online",
                    status: "SUCCESS"
                }
            },
            state: "ONLINE_CLIENT"
        }
    });

    const conversionRate = eligibleForOnline > 0 ? (paidOnline / eligibleForOnline) * 100 : 0;


    // 3. Application-to-acceptance ratio
    const totalApplications = await prisma.application.count();
    const acceptedApplications = await prisma.application.count({
        where: { status: "APPROVED" } // Schema uses 'APPROVED' instead of 'ACCEPTED'
    });
    
    const acceptanceRatio = totalApplications > 0 ? (acceptedApplications / totalApplications) : 0;


    // 4. Monthly Revenue
    // Prisma doesn't support date truncation directly easily without raw query or post-processing.
    // Let's fetch all successful payments and aggregate in JS for flexibility
    const payments = await prisma.payment.findMany({
        where: { status: "SUCCESS" },
        select: { amount: true, createdAt: true }
    });

    const revenueByMonth: Record<string, number> = {};
    
    payments.forEach(p => {
        const month = new Date(p.createdAt).toISOString().slice(0, 7); // YYYY-MM
        revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
    });

    const revenueSeries = Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue
    })).sort((a, b) => a.month.localeCompare(b.month));


    return NextResponse.json({
        leadsPerState,
        onlineConversion: {
            eligible: eligibleForOnline,
            paid: paidOnline,
            rate: conversionRate
        },
        applications: {
            total: totalApplications,
            accepted: acceptedApplications,
            ratio: acceptanceRatio
        },
        revenue: revenueSeries
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
