# Quick Start Guide

Get the Secret Santa app running in under 15 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project created
- Azure AD app registered
- SendGrid API key

## 5-Minute Setup

### 1. Install Dependencies (2 min)

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Configure Environment (3 min)

Create `.env` in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ALLOWED_DOMAIN=ineight.com
VITE_COMPANY_NAME=INE
VITE_APP_URL=http://localhost:3000
```

Create `functions/.runtimeconfig.json`:

```json
{
  "sendgrid": {
    "api_key": "YOUR_SENDGRID_API_KEY",
    "from_email": "noreply@yourdomain.com",
    "from_name": "Secret Santa"
  },
  "app": {
    "url": "http://localhost:3000",
    "support_email": "support@yourdomain.com",
    "allowed_domain": "ineight.com"
  }
}
```

### 3. Initialize Firebase (2 min)

```bash
firebase login
firebase use --add  # Select your project
firebase deploy --only firestore:rules
```

### 4. Start Development (1 min)

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
cd functions && npm run serve
```

### 5. Open App

Visit: http://localhost:3000

## First-Time Setup

If you haven't set up Firebase/Azure/SendGrid yet, follow the detailed guides:

1. **Complete Setup**: [SETUP.md](SETUP.md) - Full step-by-step guide
2. **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

## Test the App

### Create Your First Event

1. Sign in with Microsoft account
2. Click "Create Event"
3. Fill in details:
   - Title: "Test Secret Santa"
   - Min Participants: 3
4. Click "Create Event"

### Join as Participant

1. Open event from dashboard
2. Click "Join Event"
3. Optionally add gift preferences

### Perform Draw

1. Have at least 3 participants join
2. As organizer, click "Perform Secret Santa Draw"
3. Check email inboxes for assignments

## Common Commands

```bash
# Development
npm run dev                    # Start frontend
cd functions && npm run serve  # Start functions

# Build
npm run build                  # Build frontend
cd functions && npm run build  # Build functions

# Deploy
npm run deploy                 # Deploy frontend only
npm run deploy:functions       # Deploy functions only
firebase deploy                # Deploy everything

# Logs
firebase functions:log         # View function logs
```

## Troubleshooting

### Can't sign in?
- Check Azure AD redirect URI matches Firebase callback URL
- Verify email domain matches `VITE_ALLOWED_DOMAIN`

### Emails not sending?
- Verify SendGrid API key in `functions/.runtimeconfig.json`
- Check sender email is verified in SendGrid
- View logs: `firebase functions:log`

### Functions fail to deploy?
- Ensure Firebase project is on Blaze (pay-as-you-go) plan
- Run `cd functions && npm run build` to check for errors

## Next Steps

- [ ] Customize company domain in `.env`
- [ ] Update email templates in `functions/src/email.ts`
- [ ] Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))
- [ ] Set up custom domain
- [ ] Configure monitoring

## Getting Help

- **Full Setup**: [SETUP.md](SETUP.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues**: Create an issue on GitHub

---

Happy Secret Santa organizing! 🎅🎁

