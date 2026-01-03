export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // In a real application, you would use a service like Resend, SendGrid, or Nodemailer.
  // For this demo, we will log the email to the console.
  
  console.log(`
  📧 --- EMAIL SENT ---
  To: ${to}
  Subject: ${subject}
  ---------------------
  ${html.replace(/<[^>]*>/g, '')} 
  ---------------------
  (Full HTML content would be rendered in email client)
  `);

  return Promise.resolve({ success: true });
}
