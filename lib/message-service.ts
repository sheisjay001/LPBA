import { LeadState } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class MessageService {
  static async getTemplate(name: string) {
    return await prisma.messageTemplate.findUnique({ where: { name } });
  }

  static async getTemplateForState(state: LeadState) {
    return await prisma.messageTemplate.findFirst({
      where: {
        triggerState: state,
        isActive: true,
      },
    });
  }

  static replaceVariables(content: string, variables: Record<string, string>) {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  }
}
