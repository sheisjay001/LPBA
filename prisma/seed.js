const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@lpba.com' },
      update: {},
      create: {
        email: 'admin@lpba.com',
        name: 'Admin User',
        role: 'ADMIN',
        state: 'NEW', // Admin doesn't really have a state, but required
      },
    });
    console.log('Admin user ready:', admin);

    // Create Standard User
    const client = await prisma.user.upsert({
      where: { email: 'client@lpba.com' },
      update: {},
      create: {
        email: 'client@lpba.com',
        name: 'Client User',
        role: 'LEAD',
        state: 'CLIENT', // Already a client for demo purposes
      },
    });
    console.log('Client user ready:', client);

    // Message Templates
    const templates = [
      {
        name: 'Welcome Message',
        content: 'Hi {first_name}, welcome to LPBA! We are excited to help you scale your influence.',
        variables: ['first_name'],
        triggerState: 'NEW',
      },
      {
        name: 'Day 1 Value',
        content: 'Hi {first_name}, here is your first lesson on Authority Building...',
        variables: ['first_name'],
        triggerState: 'NURTURING',
      },
      {
        name: 'Day 2 Value',
        content: 'Hi {first_name}, did you know that 80% of leaders fail because...',
        variables: ['first_name'],
        triggerState: 'NURTURING',
      },
      {
        name: 'Online Program Invitation',
        content: 'Hi {first_name}, based on your profile, our Online Mastery program fits you perfectly.',
        variables: ['first_name'],
        triggerState: 'ASSESSMENT_COMPLETED',
      },
      {
        name: 'Physical Application Invitation',
        content: 'Hi {first_name}, you are ready for the next step. Apply for our Physical Intensive here.',
        variables: ['first_name'],
        triggerState: 'ONLINE_CLIENT',
      },
      {
        name: 'Acceptance Message',
        content: 'Congratulations {first_name}! You have been accepted into the program.',
        variables: ['first_name', 'program_name'],
        triggerState: 'ACCEPTED',
      },
    ];

    for (const t of templates) {
      await prisma.messageTemplate.upsert({
        where: { name: t.name },
        update: t, // Update if exists to ensure content is fresh
        create: t,
      });
    }
    console.log('Message Templates seeded.');

    // Mentorship Videos
    const videos = [
      {
        title: 'Building Your Personal Brand',
        description: 'Learn the fundamentals of establishing a strong personal brand in today\'s digital age.',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        minState: 'CLIENT',
      },
      {
        title: 'Advanced Revenue Strategies',
        description: 'Unlock hidden revenue streams in your consulting business.',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        minState: 'CLIENT',
      },
      {
        title: 'Welcome to LPBA',
        description: 'An introduction to our ecosystem and how to get the most out of it.',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        minState: 'NEW', // Visible to everyone
      },
    ];

    for (const v of videos) {
      const exists = await prisma.mentorshipVideo.findFirst({ where: { title: v.title } });
      if (!exists) {
        await prisma.mentorshipVideo.create({ data: v });
      }
    }
    console.log('Mentorship Videos seeded.');

  } catch (e) {
    console.error('Error seeding data:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
