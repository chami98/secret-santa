import * as sgMail from '@sendgrid/mail';

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

interface EmailParams {
  to: string;
  santaName: string;
  recipientName: string;
  recipientEmail: string;
  recipientNote?: string;
  eventTitle: string;
  giftBudget?: string;
  deliveryDate?: string;
  confirmLink: string;
}

/**
 * Generates HTML email template for Secret Santa assignment
 */
function generateEmailHtml(params: EmailParams): string {
  const {
    santaName,
    recipientName,
    recipientEmail,
    recipientNote,
    eventTitle,
    giftBudget,
    deliveryDate,
    confirmLink,
  } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Secret Santa Assignment</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #FF6B35 0%, #1E3A5F 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .recipient-box {
      background: #f5f5f5;
      border-left: 4px solid #FF6B35;
      padding: 20px;
      margin: 20px 0;
    }
    .recipient-name {
      font-size: 24px;
      font-weight: bold;
      color: #FF6B35;
      margin-bottom: 10px;
    }
    .detail-item {
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      background: #FF6B35;
      color: white !important;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="header">
    <!-- Logo (falls back to text if image not available) -->
    <div style="margin-bottom: 15px;">
      <img src="${params.appUrl || 'https://your-app.web.app'}/logos/ineight-logo-white.png" 
           alt="InEight" 
           style="height: 40px; width: auto;"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <div style="display: none; font-size: 24px; font-weight: bold;">InEight</div>
    </div>
    <h1>🎅 Secret Santa Assignment</h1>
  </div>
  
  <div class="content">
    <p>Hi <strong>${santaName}</strong>,</p>
    
    <p>You've been assigned a Secret Santa recipient for <strong>${eventTitle}</strong>!</p>
    
    <div class="recipient-box">
      <div class="recipient-name">🎁 ${recipientName}</div>
      <div class="detail-item">
        <strong>Email:</strong> ${recipientEmail}
      </div>
    </div>
    
    ${recipientNote ? `
      <div class="detail-item">
        <strong>Gift Preferences:</strong>
        <div style="background: #f9f9f9; padding: 15px; margin-top: 10px; border-radius: 5px;">
          ${recipientNote}
        </div>
      </div>
    ` : ''}
    
    ${giftBudget ? `
      <div class="detail-item">
        <strong>Gift Budget:</strong> ${giftBudget}
      </div>
    ` : ''}
    
    ${deliveryDate ? `
      <div class="detail-item">
        <strong>Delivery Date:</strong> ${deliveryDate}
      </div>
    ` : ''}
    
    <div style="text-align: center;">
      <a href="${confirmLink}" class="button">View Assignment Online</a>
    </div>
    
    <div class="warning">
      <strong>🤫 Remember:</strong> Keep this assignment secret! Don't share it with anyone, especially not your recipient.
    </div>
    
    <p>If you have any questions or concerns, please contact the event organizer.</p>
    
    <p>Happy gifting! 🎄</p>
  </div>
  
  <div class="footer">
    <p>This is an automated message from Secret Santa.</p>
    <p>If you believe you received this email in error, please contact ${process.env.SUPPORT_EMAIL || 'support'}.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generates plain text email for Secret Santa assignment
 */
function generateEmailText(params: EmailParams): string {
  const {
    santaName,
    recipientName,
    recipientEmail,
    recipientNote,
    eventTitle,
    giftBudget,
    deliveryDate,
  } = params;

  let text = `Hi ${santaName},\n\n`;
  text += `You've been assigned a Secret Santa recipient for ${eventTitle}!\n\n`;
  text += `You're the Secret Santa for:\n`;
  text += `Name: ${recipientName}\n`;
  text += `Email: ${recipientEmail}\n\n`;

  if (recipientNote) {
    text += `Gift Preferences:\n${recipientNote}\n\n`;
  }

  if (giftBudget) {
    text += `Gift Budget: ${giftBudget}\n`;
  }

  if (deliveryDate) {
    text += `Delivery Date: ${deliveryDate}\n`;
  }

  text += `\n🤫 Remember: Keep this assignment secret!\n\n`;
  text += `If you have any questions, please contact the event organizer.\n\n`;
  text += `Happy gifting! 🎄\n`;

  return text;
}

/**
 * Sends Secret Santa assignment email via SendGrid
 */
export async function sendAssignmentEmail(params: EmailParams): Promise<void> {
  if (!apiKey) {
    throw new Error('SendGrid API key not configured');
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';
  const fromName = process.env.SENDGRID_FROM_NAME || 'Secret Santa';

  const msg = {
    to: params.to,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject: `You are the Secret Santa for ${params.recipientName} 🎅`,
    text: generateEmailText(params),
    html: generateEmailHtml(params),
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${params.to}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error(`Failed to send email to ${params.to}`);
  }
}

