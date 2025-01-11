export default function verifyEmailTemplate(name: string, pin: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Kredi Bank</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #FFA500; /* Orange color */
        padding: 20px;
        text-align: center;
        color: #fff;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        text-align: left;
        line-height: 1.6;
      }
      .content h1 {
        font-size: 22px;
        color: #111;
      }
      .content p {
        font-size: 16px;
      }
      .pin {
        display: block;
        margin: 20px 0;
        font-size: 18px;
        font-weight: bold;
        color: #FFA500;
        text-align: center;
      }
      .footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 10px;
        font-size: 14px;
      }
      .footer a {
        color: #FFA500;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        Welcome to Kredi Bank!
      </div>
      <div class="content">
        <h1>Hello, ${name}!</h1>
        <p>Thank you for joining our platform. We're thrilled to have you on board.</p>
        <p>Use this one-time token below to verify your account with us:</p>
        <div class="pin">${pin}</div>
        <p><strong>Note:</strong> This token expires after 5 minutes.</p>
        <p>Thank you for choosing Kredi Bank.</p>
      </div>
      <div class="footer">
        Copyright © 2024 The Kredi Bank. All rights reserved.
        <br>
        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
      </div>
    </div>
  </body>
  </html>`;
}
