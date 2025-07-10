export const emailVerificationTemplate = (name, otp) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      h2 {
        text-align: center;
        color: #2d89ef;
      }
      .content {
        font-size: 16px;
        color: #333;
        line-height: 1.6;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #2d89ef;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        color: #aaa;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Verify Your Email</h2>
      <p class="content">Hi ${name},</p>
      <p class="content">Thanks for registering! Use the OTP below to verify your email address and activate your account:</p>
      <div class="otp">${otp}</div>
      <p class="content">This OTP is valid for 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      <div class="footer">© 2024 E-Learn Quiz. All rights reserved.</div>
    </div>
  </body>
  </html>
`;