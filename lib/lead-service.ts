import { LeadState } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const STATE_RANK: Record<LeadState, number> = {
  NEW: 1,
  ASSESSMENT_COMPLETED: 2,
  NURTURING: 3,
  ONLINE_CLIENT: 4,
  APPLIED_PHYSICAL: 5,
  ACCEPTED: 6,
  CLIENT: 7,
};

export class LeadService {
  /**
   * Enforces state transition rules and logs changes.
   */
  static async updateState(userId: string, newState: LeadState, reason?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const currentRank = STATE_RANK[user.state];
    const newRank = STATE_RANK[newState];

    // "States can only move forward"
    // We allow staying in the same state (idempotency)
    if (newRank < currentRank) {
       throw new Error(`Invalid state transition: Cannot move back from ${user.state} to ${newState}`);
    }

    if (user.state === newState) return user;

    // Transaction: Log + Update
    return await prisma.$transaction(async (tx) => {
      await tx.leadLog.create({
        data: {
          userId,
          previousState: user.state,
          newState,
          reason: reason || `Transition to ${newState}`,
        },
      });

      return await tx.user.update({
        where: { id: userId },
        data: { state: newState },
      });
    });
  }

  /**
   * Pauses automation when human attention is required.
   */
  static async pauseAutomation(userId: string, reason: string) {
    // Also log this as a significant event? 
    // For now, just update flags.
    return await prisma.user.update({
      where: { id: userId },
      data: {
        automationEnabled: false,
        humanRequired: true,
      },
    });
  }

  /**
   * Resumes automation (Admin only usually).
   */
  static async resumeAutomation(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        automationEnabled: true,
        humanRequired: false,
      },
    });
  }
}
