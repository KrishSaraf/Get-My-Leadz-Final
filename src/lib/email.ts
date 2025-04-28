import emailjs from '@emailjs/browser';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  recipientName: string;
  leadType: 'inbound' | 'outbound';
}

export async function sendEmail({
  to,
  subject,
  text,
  recipientName,
  leadType,
}: EmailOptions) {
  // Construct the email message
  const emailBody = getEmailBody(recipientName, text, leadType);

  // Check required environment variables
  if (
    !import.meta.env.VITE_EMAILJS_SERVICE_ID ||
    !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
    !import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  ) {
    throw new Error('EmailJS environment variables are missing or undefined');
  }

  try {
    // Send the email via EmailJS
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,    // Service ID from EmailJS
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,   // Template ID from EmailJS
      {
        to_email: to,
        to_name: recipientName,
        subject: subject,
        message: emailBody,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY     // Your Public Key
    );

    // EmailJS typically responds with { status: 200, text: 'OK' } on success
    if (result.status === 200 && result.text === 'OK') {
      return { success: true, result };
    } else {
      throw new Error(
        `EmailJS returned an unexpected response: ${JSON.stringify(result)}`
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

function getEmailBody(
  recipientName: string,
  customText: string,
  leadType: 'inbound' | 'outbound'
): string {
  const signature = `
Best regards,
Nexus AI Team

50 Nanyang Ave, Block N 4, Singapore 639798`;

  if (leadType === 'inbound') {
    return `Dear ${recipientName},

${customText}

Thank you for reaching out to Nexus AI. We're excited to share more about our AI-powered solutions and how they can meet your needs.

1. AI File Chat – Perfect for researchers, marketers, and professionals
2. AI ReWriter Tool – Ideal for students and professionals
3. AI Academic Writing – A robust platform for writing and citing
4. AI Text to Speech – Dynamic text-to-speech solution
5. AI Image Generator – Turn imagination into reality
6. AI Code Generator – Streamline your coding workflow

If you have any questions, feel free to contact us at (+65) 6123 4567.

${signature}`;
  } else {
    return `Dear ${recipientName},

${customText}

Imagine simplifying your work and amplifying your creativity with Nexus AI's innovative solutions:

1. AI File Chat: Smarter document comprehension
2. AI ReWriter Tool: Craft impactful content
3. AI Academic Writing: Seamless writing tools
4. AI Text-to-Speech: 120+ natural voices
5. AI Image Generator: Transform ideas into visuals
6. AI Code Generator: Streamline coding

Ready to elevate your productivity? Let's connect!

${signature}`;
  }
}
