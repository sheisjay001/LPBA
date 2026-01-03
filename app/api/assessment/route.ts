import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { LeadService } from "@/lib/lead-service";
import { MessageService } from "@/lib/message-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, answers } = body;

    // Simple scoring logic (mock)
    let score = 0;
    Object.values(answers).forEach((val: any) => {
      if (typeof val === 'number') score += val;
    });

    let result = "Entry Level";
    let recommendation = "Online Program (₦50,000 – ₦150,000)";

    if (score > 10) { 
      result = "High Potential";
      recommendation = "Physical Program (₦500,000+)";
    }

    // Create or Update User
    // Ensure state is initialized if creating
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, phone },
      create: { email, name, phone, state: 'NEW' },
    });

    // Update State to ASSESSMENT_COMPLETED
    // We swallow errors if state transition fails (e.g. user is already a CLIENT retaking assessment)
    try {
        await LeadService.updateState(user.id, 'ASSESSMENT_COMPLETED', `Assessment Result: ${result}`);
    } catch (e) {
        console.warn(`State transition skipped for ${email}:`, e);
    }

    // Save Assessment
    await prisma.assessment.create({
      data: {
        score,
        answers,
        result,
        userId: user.id,
      },
    });

    // Fetch Template for Email
    const template = await MessageService.getTemplateForState('ASSESSMENT_COMPLETED');
    let emailHtml = "";
    
    if (template && template.isActive) {
        // Replace variables
        const content = MessageService.replaceVariables(template.content, {
            first_name: name.split(' ')[0],
            result: result,
            recommendation: recommendation,
            program_name: recommendation, // Alias
        });
        
        // Simple HTML wrapper
        emailHtml = `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Hi ${name.split(' ')[0]},</h1>
                <p>${content}</p>
                <p><strong>Your Result:</strong> ${result}</p>
                <p><strong>Recommended Path:</strong> ${recommendation}</p>
                <br>
                <p>Best regards,<br>LPBA Consulting Team</p>
            </div>
        `;
    } else {
        // Fallback if template missing
        emailHtml = `
            <h1>Hi ${name},</h1>
            <p>Thank you for taking the LPBA Assessment.</p>
            <p><strong>Your Result:</strong> ${result}</p>
            <p><strong>Recommended Path:</strong> ${recommendation}</p>
            <p>Click <a href="https://lpba-consulting.com/application">here</a> to apply for the next steps.</p>
        `;
    }

    // Send Email
    await sendEmail({ to: email, subject: `Your LPBA Assessment Result: ${result}`, html: emailHtml });

    return NextResponse.json({
      success: true,
      result,
      recommendation,
    });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process assessment" },
      { status: 500 }
    );
  }
}
