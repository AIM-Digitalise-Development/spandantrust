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
 * Sends acknowledgement email upon account creation informing the user that approval is pending.
 */
export async function sendRegistrationReceivedEmail({ toEmail, name, role }) {
  const fromName = process.env.MAIL_FROM_NAME || 'SpandanTrust';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'noreply@spandantrust.org';

  const subject = `Registration Received - SpandanTrust (${role})`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0d9488; margin-top: 0;">Registration Received</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your account registration as a <strong>${role}</strong> has been successfully created in the SpandanTrust Digital OPD & Medicine Distribution System.</p>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">Status: Pending Administrator Approval</p>
        <p style="margin: 5px 0 0 0; color: #78350f; font-size: 14px;">Once your account is reviewed and activated by the Administrator, you will receive another email containing your login credentials to access your dashboard.</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated system email. Please do not reply directly.</p>
    </div>
  `;

  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH] Registration Received for ${name} (${role})`);
  console.log(`Target Email: ${toEmail}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email Warning] Gmail SMTP credentials missing in .env.local. Registration email logged to console above.');
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
    console.error('Failed to send registration received email via Nodemailer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends account approval email with login credentials when Admin activates the user account.
 */
export async function sendAccountApprovedEmail({ toEmail, name, userId, initialPassword, role }) {
  const fromName = process.env.MAIL_FROM_NAME || 'SpandanTrust';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'noreply@spandantrust.org';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const subject = `Account Approved - Your SpandanTrust ${role} Credentials`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0d9488; margin-top: 0;">Account Approved!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Great news! Your account as a <strong>${role}</strong> in the SpandanTrust Digital OPD & Medicine Distribution System has been approved by the Administrator.</p>
      <p>You can now log into your account using the credentials below:</p>
      
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

  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH] Account Approved for ${name} (${role})`);
  console.log(`Target Email: ${toEmail}`);
  console.log(`User ID: ${userId}`);
  console.log(`Initial Password (DOB): ${initialPassword}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email Warning] Gmail SMTP credentials missing in .env.local. Approval email logged to console above.');
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
    console.error('Failed to send account approval email via Nodemailer:', error);
    return { success: false, error: error.message };
  }
}

// Alias sendWelcomeEmail for backward compatibility
export const sendWelcomeEmail = sendAccountApprovedEmail;

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
