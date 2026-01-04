import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LeadService } from "@/lib/lead-service";
import { AppScore } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, program, experience, goals, commitment } = body;

    // Phase 2: Scoring Logic
    let scoreVal = 0;
    const detailsScore = { budget: 0, experience: 0, goals: 0 };

    // Budget/Commitment Scoring
    const commitmentLower = commitment?.toLowerCase() || "";
    if (commitmentLower.includes("ready") || commitmentLower.includes("budget") || commitmentLower.includes("pay") || commitmentLower.includes("yes")) {
        scoreVal += 5;
        detailsScore.budget = 5;
    } else if (commitmentLower.length > 20) {
        scoreVal += 2;
        detailsScore.budget = 2;
    }

    // Experience Scoring
    if (experience && experience.length > 50) {
        scoreVal += 3;
        detailsScore.experience = 3;
    }

    // Goals Scoring
    if (goals && goals.length > 50) {
        scoreVal += 3;
        detailsScore.goals = 3;
    }

    let finalScore: AppScore = "UNSCORED";
    if (scoreVal >= 8) finalScore = "STRONG";
    else if (scoreVal >= 4) finalScore = "MODERATE";
    else finalScore = "WEAK";

    // Create or Update User
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        phone,
      },
      create: {
        email,
        name,
        phone,
        state: 'NEW', // Default state
      },
    });

    // Phase 1: State Enforcement -> APPLIED_PHYSICAL
    try {
        await LeadService.updateState(user.id, 'APPLIED_PHYSICAL', `Application Submitted. Score: ${finalScore}`);
        
        // Phase 1: Automation Pause
        // "Automation should pause when... User mentions physical programs" (Application implies this)
        await LeadService.pauseAutomation(user.id, "User applied for Physical Program");
    } catch (e) {
        console.warn(`State transition skipped for ${email}:`, e);
    }

    // Create Application
    await prisma.application.create({
      data: {
        program,
        details: {
          experience,
          goals,
          commitment
        },
        userId: user.id,
        score: finalScore,
        scoreDetails: detailsScore as any,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
