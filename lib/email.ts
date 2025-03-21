import { SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_SECURE, SMTP_USER } from '@/consts';
import nodemailer from 'nodemailer';

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create a transporter with SMTP configuration
const transporter = nodemailer.createTransport({
  host: SMTP_HOST!,
  port: parseInt(SMTP_PORT!),
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER!,
    pass: SMTP_PASSWORD!,
  },
});

/**
 * Sends an email using the configured SMTP service
 */
export async function sendEmail({ to, subject, text, html }: EmailParams): Promise<void> {
  try {
    const mailOptions = {
      from: SMTP_FROM!,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

/**
 * Generates a random password of specified length
 */
export function generateRandomPassword(length: number = 10): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+{}[]|:;<>,.?/~';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure we have at least one of each character type
  let password = 
    uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)) +
    lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)) +
    numberChars.charAt(Math.floor(Math.random() * numberChars.length)) +
    specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Sends a one-time password to the user's email
 */
export async function sendOneTimePassword(email: string): Promise<string> {
  const oneTimePassword = generateRandomPassword(10);
  const subject = 'Your One-Time Password';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #333;">Welcome to our platform!</h2>
      <p>You've successfully logged in using a social provider.</p>
      <p>We've generated a one-time password for you to use with our credentials system:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; font-size: 16px; text-align: center;">
        ${oneTimePassword}
      </div>
      <p>You can use this password along with your email to log in directly to our platform in the future.</p>
      <p>We recommend changing this password after your first login for security reasons.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        This is an automated message, please do not reply to this email.
      </p>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject,
    html
  });
  return oneTimePassword;
}

/**
 * Sends a password reset email with a verification token
 */
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 5px; direction: rtl; text-align: right;">
      <h2 style="color: #333;">בקשת איפוס סיסמה</h2>
      <p>קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הקישור למטה כדי לאפס את הסיסמה שלך:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          איפוס סיסמה
        </a>
      </div>
      <p>הקישור תקף ל-24 שעות בלבד.</p>
      <p>אם לא ביקשת לאפס את הסיסמה שלך, אנא התעלם מהודעה זו או צור קשר עם צוות התמיכה.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px;">
        הודעה זו נשלחה באופן אוטומטי, אנא אל תשיב לאימייל זה.
      </p>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject,
    html
  });
}
