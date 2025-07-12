export const emailVerificationTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #1d8348; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; margin: 0;">Mazracare</h1>
        <p style="color: #dff0d8; margin: 5px 0 0;">Your Trusted E-commerce Partner</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #333333;">Hello ${name},</h2>
        <p style="font-size: 16px; color: #555555;">Thank you for signing up with <strong>Mazracare</strong>. To complete your registration, please verify your email using the OTP below:</p>
        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; background-color: #1d8348; color: #ffffff; padding: 14px 32px; font-size: 24px; border-radius: 6px; letter-spacing: 5px; font-weight: bold;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888888;">This OTP is valid for only 10 minutes. Please do not share it with anyone.</p>
        <p style="font-size: 14px; color: #888888;">If you did not request this, you can safely ignore this email.</p>
        <p style="font-size: 16px; color: #555555; margin-top: 40px;">Warm regards,<br><strong>The Mazracare Team</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f1f1f1; font-size: 12px; color: #888888; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        © ${new Date().getFullYear()} Mazracare. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;



export const resendOtpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>OTP Resend - Mazracare</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #1d8348; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; margin: 0;">Mazracare</h1>
        <p style="color: #dff0d8; margin: 5px 0 0;">Secure Login OTP</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #333333;">Hello ${name},</h2>
        <p style="font-size: 16px; color: #555555;">You have requested to resend your OTP. Please use the OTP below to proceed with verifying your email address.</p>
        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; background-color: #1d8348; color: #ffffff; padding: 14px 32px; font-size: 24px; border-radius: 6px; letter-spacing: 5px; font-weight: bold;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888888;">This OTP will expire in 10 minutes. Do not share it with anyone for your own security.</p>
        <p style="font-size: 14px; color: #888888;">If you did not request this, please ignore this email or contact support.</p>
        <p style="font-size: 16px; color: #555555; margin-top: 40px;">Thank you,<br><strong>The Mazracare Team</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f1f1f1; font-size: 12px; color: #888888; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        © ${new Date().getFullYear()} Mazracare. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const resetPasswordOtpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset OTP - Mazracare</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #1d8348; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; margin: 0;">Mazracare</h1>
        <p style="color: #dff0d8; margin: 5px 0 0;">Password Reset Request</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #333333;">Hi ${name},</h2>
        <p style="font-size: 16px; color: #555555;">We received a request to reset your password. Please use the OTP below to proceed:</p>
        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; background-color: #1d8348; color: #ffffff; padding: 14px 32px; font-size: 24px; border-radius: 6px; letter-spacing: 5px; font-weight: bold;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888888;">This OTP is valid for 10 minutes. If you didn’t request a password reset, you can safely ignore this email.</p>
        <p style="font-size: 16px; color: #555555; margin-top: 40px;">Stay safe,<br><strong>The Mazracare Team</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f1f1f1; font-size: 12px; color: #888888; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        © ${new Date().getFullYear()} Mazracare. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;


