import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LeadService } from "@/lib/lead-service";
import { MessageService } from "@/lib/message-service";
import { sendEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // 1. Update Application Status & Generate Payment Link
    // In a real system, we might integrate with Paystack API here to generate a transaction reference
    const paymentLink = `https://lpba-consulting.com/pay?appId=${id}`; 
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // 3 days expiry

    await prisma.application.update({
      where: { id },
      data: {
        status: 'APPROVED',
        paymentLink,
        paymentExpiresAt: expiresAt,
      },
    });

    // 2. Update User State -> ACCEPTED
    // We try/catch this to ensure we don't fail the whole request if state logic is strict,
    // though ideally we want this to succeed.
    try {
        await LeadService.updateState(application.userId, 'ACCEPTED', `Application Approved by Admin`);
    } catch (e) {
        console.warn("State update failed:", e);
    }

    // 3. Send Email
    const template = await MessageService.getTemplateForState('ACCEPTED');
    let emailHtml = "";
    if (template && template.isActive) {
         const content = MessageService.replaceVariables(template.content, {
            first_name: application.user.name?.split(' ')[0] || 'Leader',
            program_name: application.program,
            payment_link: paymentLink,
        });
        emailHtml = `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Congratulations!</h1>
                <p>${content}</p>
                <br>
                <a href="${paymentLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Secure Your Spot</a>
                <p>Link expires in 3 days.</p>
            </div>
        `;
    } else {
        emailHtml = `
            <h1>Congratulations!</h1>
            <p>You have been accepted into the ${application.program}.</p>
            <p>Please click the link below to complete your payment and secure your spot:</p>
            <a href="${paymentLink}">${paymentLink}</a>
        `;
    }

    await sendEmail({
        to: application.user.email,
        subject: "Congratulations! You've been accepted to LPBA",
        html: emailHtml
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Acceptance error:", error);
    return NextResponse.json({ error: "Failed to accept application" }, { status: 500 });
  }
}
