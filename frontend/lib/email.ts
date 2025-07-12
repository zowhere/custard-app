interface AuthEmailProps {
  code: string;
  link: string;
  userName?: string;
  expirationMinutes?: number;
}

export function createAuthEmailTemplate({
  code,
  expirationMinutes = 10,
}: AuthEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custard - Verification Code</title>
  <style>
    /* Reset styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      padding: 32px 24px;
      text-align: center;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      color: white;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
    
    .header-title {
      color: white;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    
    .header-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      margin: 8px 0 0 0;
    }
    
    .content {
      padding: 40px 24px;
    }
    
    .greeting {
      font-size: 18px;
      color: #111827;
      margin-bottom: 24px;
    }
    
    .message {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    
    .verification-section {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      margin-bottom: 32px;
      border: 2px dashed #d1d5db;
    }
    
    .verification-label {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    
    .verification-code {
      font-size: 36px;
      font-weight: bold;
      color: #7c3aed;
      font-family: 'Courier New', monospace;
      letter-spacing: 8px;
      margin-bottom: 16px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
    }
    
    .verification-note {
      font-size: 14px;
      color: #6b7280;
    }
    
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .verify-button {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s ease;
    }
    
    .verify-button:hover {
      transform: translateY(-1px);
    }
    
    .alternative-section {
      background: #f9fafb;
      border-radius: 8px;
      padding: 24px;
      margin: 32px 0;
    }
    
    .alternative-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
    }
    
    .alternative-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    
    .alternative-link {
      word-break: break-all;
      color: #7c3aed;
      text-decoration: none;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      background: white;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      display: block;
    }
    
    .security-notice {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .security-title {
      font-size: 14px;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .security-text {
      font-size: 14px;
      color: #92400e;
    }
    
    .footer {
      background: #f9fafb;
      padding: 32px 24px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 16px;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 16px;
    }
    
    .footer-link {
      color: #7c3aed;
      text-decoration: none;
      font-size: 14px;
    }
    
    .footer-link:hover {
      text-decoration: underline;
    }
    
    .footer-copyright {
      font-size: 12px;
      color: #9ca3af;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .header {
        padding: 24px 16px;
      }
      
      .content {
        padding: 32px 16px;
      }
      
      .verification-section {
        padding: 24px 16px;
      }
      
      .verification-code {
        font-size: 28px;
        letter-spacing: 4px;
      }
      
      .footer {
        padding: 24px 16px;
      }
      
      .footer-links {
        flex-direction: column;
        gap: 12px;
      }
    }
  </style>
</head>
<body>
  <div style="background-color: #f9fafb; padding: 20px 0;">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <div class="logo-icon">A</div>
          <div class="logo-text">Custard</div>
        </div>
        <h1 class="header-title">Verify Your Account</h1>
        <p class="header-subtitle">Complete your sign-in to access your loyalty program</p>
      </div>
      
      <!-- Main Content -->
      <div class="content">
        <div class="greeting">
          Hi! 👋
        </div>
        
        <div class="message">
          We received a request to sign in to your Custard account. To complete the process, please use the verification code below or click the verification button.
        </div>
        
        <!-- Verification Code Section -->
        <div class="verification-section">
          <div class="verification-label">Your Verification Code</div>
          <div class="verification-code">${code}</div>
          <div class="verification-note">
            This code will expire in ${expirationMinutes} minutes
          </div>
        </div>
    
        
        <!-- Security Notice -->
        <div class="security-notice">
          <div class="security-title">
            🔒 Security Notice
          </div>
          <div class="security-text">
            If you didn't request this verification code, please ignore this email. Your account remains secure.
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">
          This email was sent by Custard. If you have any questions, we're here to help.
        </div>
        
        <div class="footer-links">
          <a href="https://custard-app.vercel.app/help" class="footer-link">Help Center</a>
          <a href="https://custard-app.vercel.app/privacy" class="footer-link">Privacy Policy</a>
          <a href="https://custard-app.vercel.app/terms" class="footer-link">Terms of Service</a>
        </div>
        
        <div class="footer-copyright">
          © ${new Date().getFullYear()} Custard. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function createWelcomeEmailTemplate({
  userName = "there",
}: {
  userName?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Custard</title>
  <style>
    /* Same base styles as above */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f9fafb;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      padding: 32px 24px;
      text-align: center;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      color: white;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
    
    .header-title {
      color: white;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    
    .content {
      padding: 40px 24px;
    }
    
    .welcome-message {
      font-size: 18px;
      color: #111827;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .features {
      margin: 32px 0;
    }
    
    .feature {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .feature-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      flex-shrink: 0;
    }
    
    .feature-content h3 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }
    
    .feature-content p {
      font-size: 14px;
      color: #6b7280;
    }
    
    .cta-section {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      margin: 32px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div style="background-color: #f9fafb; padding: 20px 0;">
    <div class="email-container">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">A</div>
          <div class="logo-text">Custard</div>
        </div>
        <h1 class="header-title">Welcome to Custard! 🎉</h1>
      </div>
      
      <div class="content">
        <div class="welcome-message">
          Hi ${userName}! We're thrilled to have you join the Custard community.
        </div>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🚀</div>
            <div class="feature-content">
              <h3>Quick Setup</h3>
              <p>Get your loyalty program running in under 10 minutes with our guided setup process.</p>
            </div>
          </div>
          
          <div class="feature">
            <div class="feature-icon">📱</div>
            <div class="feature-content">
              <h3>Mobile-First Experience</h3>
              <p>Your customers can earn and redeem points seamlessly on any device.</p>
            </div>
          </div>
          
          <div class="feature">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h3>Smart Analytics</h3>
              <p>Track customer behavior and measure your program's ROI with detailed insights.</p>
            </div>
          </div>
        </div>
        
        <div class="cta-section">
          <h3>Ready to get started?</h3>
          <p>Complete your account setup and launch your first loyalty program.</p>
          <a href="https://app.Custard.xyz/onboarding" class="cta-button">
            Complete Setup →
          </a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function createLoyaltyPointsEmailTemplate({
  userName = "there",
  pointsEarned = 0,
  redemptionLink = "https://app.Custard.xyz/rewards",
}: {
  userName?: string;
  pointsEarned: number;
  redemptionLink?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Loyalty Points Update - Custard</title>
  <style>
    /* Base styles for email client compatibility */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f9fafb;
      -webkit-text-size-adjust: 100%; /* Prevent iOS text size adjustment */
      -ms-text-size-adjust: 100%;    /* Prevent Windows Phone text size adjustment */
      width: 100% !important;        /* Ensure full width on mobile */
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      /* Fallback for older clients that don't support box-shadow */
      border: 1px solid #e5e7eb;
    }

    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      padding: 32px 24px;
      text-align: center;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      color: white;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }

    .header-title {
      color: white;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }

    .content {
      padding: 40px 24px;
    }

    .greeting-message {
      font-size: 18px;
      color: #111827;
      margin-bottom: 24px;
      text-align: center;
    }

    .points-summary {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin-bottom: 32px;
    }

    .points-summary h2 {
      font-size: 24px;
      color: #111827;
      margin-bottom: 8px;
    }

    .points-summary p {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 4px;
    }

    .points-value {
      font-size: 36px;
      font-weight: bold;
      color: #2563eb; /* Primary brand color for emphasis */
      margin-top: 16px;
    }

    .how-to-use {
      margin-bottom: 32px;
    }

    .how-to-use h3 {
      font-size: 20px;
      color: #111827;
      margin-bottom: 16px;
      text-align: center;
    }

    .how-to-use ul {
      list-style: none;
      padding-left: 0;
    }

    .how-to-use li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 15px;
      color: #4b5563;
    }

    .how-to-use li::before {
      content: '•'; /* Custom bullet point */
      color: #2563eb;
      font-size: 20px;
      line-height: 1;
      flex-shrink: 0;
    }

    .cta-section {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      margin-top: 32px;
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 16px;
      /* Ensure button is clickable and visible */
      -webkit-font-smoothing: antialiased;
      text-transform: none;
      white-space: nowrap;
    }

    .footer {
      text-align: center;
      padding: 24px;
      font-size: 12px;
      color: #6b7280;
    }

    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div style="background-color: #f9fafb; padding: 20px 0;">
    <div class="email-container">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">A</div>
          <div class="logo-text">Custard</div>
        </div>
        <h1 class="header-title">Your Loyalty Points Update! 🌟</h1>
      </div>

      <div class="content">
        <p class="greeting-message">
          Hi ${userName}!
        </p>
        <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
          Great news! You've just earned **${pointsEarned} loyalty points** with Custard!
          Your dedication is truly appreciated.
        </p>

        <div class="how-to-use">
          <h3>How to Use Your Points:</h3>
          <ul>
            <li>Earned points can be redeemed for exclusive discounts on future purchases.</li>
            <li>Unlock special access to premium features or content.</li>
            <li>Exchange points for unique gifts and merchandise.</li>
            <li>Participate in members-only events and giveaways.</li>
          </ul>
          <p style="font-size: 15px; color: #374151; margin-top: 20px;">
            Visit your rewards dashboard to see all the amazing ways you can use your points.
          </p>
        </div>

        <div class="cta-section">
          <h3>Ready to redeem your rewards?</h3>
          <p>Click below to explore your personalized rewards dashboard.</p>
          <a href="${redemptionLink}" class="cta-button" target="_blank" rel="noopener noreferrer">
            <p style="color: #FFFFFF;">Redeem Your Points →</p>
          </a>
        </div>

        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 32px;">
          Thank you for being a valued member of the Custard community!
        </p>
      </div>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Custard. All rights reserved.</p>
        <p>
          <a href="https://Custard.xyz/privacy" style="color: #2563eb;">Privacy Policy</a> |
          <a href="https://Custard.xyz/terms" style="color: #2563eb;">Terms of Service</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
