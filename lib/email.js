import nodemailer from 'nodemailer';

const isMailConfigured = () => {
  return (
    process.env.MAIL_HOST &&
    process.env.MAIL_PORT &&
    process.env.MAIL_USERNAME &&
    process.env.MAIL_PASSWORD
  );
};

const createTransporter = () => {
  if (!isMailConfigured()) return null;

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

/**
 * Sends welcome login credentials email to newly created Coordinator, Supervisor, or Agent.
 */
export async function sendWelcomeEmail({ toEmail, name, userId, initialPassword, role }) {
  const fromName = process.env.MAIL_FROM_NAME || 'SpandanTrust';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'noreply@spandantrust.org';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spandantrust-two.vercel.app/';

  const subject = `Welcome to SpandanTrust - Your ${role} Credentials`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0d9488; margin-top: 0;">Welcome, ${name}!</h2>
      <p>Your account as a <strong>${role}</strong> has been successfully created in the SpandanTrust Digital OPD & Medicine Distribution System.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Your Login Credentials</h3>
        <p style="margin: 5px 0;"><strong>User ID:</strong> <code style="font-size: 16px; color: #0f766e; background: #ccfbf1; padding: 2px 6px; border-radius: 4px;">${userId}</code></p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${toEmail}</p>
        <p style="margin: 5px 0;"><strong>Initial Password:</strong> <code style="font-size: 16px; color: #991b1b; background: #fee2e2; padding: 2px 6px; border-radius: 4px;">${initialPassword}</code></p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">*(Note: Your initial password is set to your Date of Birth in DD-MM-YYYY format. Please change it after logging in.)*</p>
      </div>

      <p style="margin-top: 25px;">
        <a href="${appUrl}/login" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Log In to Dashboard</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated system email. Please do not reply directly.</p>
    </div>
  `;

  // Safe fallback console logging
  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH] ${role} Account Created for ${name}`);
  console.log(`Target Email: ${toEmail}`);
  console.log(`User ID: ${userId}`);
  console.log(`Initial Password (DOB): ${initialPassword}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email Warning] Gmail SMTP credentials missing in .env.local. Email dispatch logged to console above.');
    return { success: true, loggedToConsole: true };
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email via Nodemailer:', error);
    // Return success true so dev workflow is not halted by invalid SMTP credentials
    return { success: false, error: error.message };
  }
}

/**
 * Sends Password Reset Email containing secure token link.
 */
export async function sendPasswordResetEmail({ toEmail, name, resetUrl }) {
  const fromName = process.env.MAIL_FROM_NAME || 'SpandanTrust';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'noreply@spandantrust.org';

  const subject = `Password Reset Request - SpandanTrust`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0d9488; margin-top: 0;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the button below to specify a new password:</p>
      
      <p style="margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset My Password</a>
      </p>

      <p style="font-size: 13px; color: #4b5563;">Or copy and paste this link into your browser:</p>
      <p style="font-size: 12px; color: #2563eb; word-break: break-all;">${resetUrl}</p>

      <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
    </div>
  `;

  console.log(`\n======================================================`);
  console.log(`[PASSWORD RESET EMAIL] Requested for ${toEmail}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email Warning] Gmail SMTP credentials missing in .env.local. Reset URL logged to console above.');
    return { success: true, loggedToConsole: true };
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send reset email via Nodemailer:', error);
    return { success: false, error: error.message };
  }
}
