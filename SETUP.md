# Secret Santa - Detailed Setup Guide

This guide walks you through every step to get the Secret Santa app running from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Azure AD Setup](#azure-ad-setup)
4. [SendGrid Setup](#sendgrid-setup)
5. [Local Development](#local-development)
6. [Production Deployment](#production-deployment)
7. [Verification](#verification)

---

## Prerequisites

### Required Software
```bash
# Node.js 18+
node --version  # Should be v18.0.0 or higher

# npm
npm --version

# Firebase CLI
npm install -g firebase-tools
firebase --version
```

### Required Accounts
- Google account (for Firebase)
- Microsoft Azure account (for Azure AD)
- SendGrid account (for emails)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name (e.g., "secret-santa-yourcompany")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (e.g., "us-central")
5. Click "Enable"

### Step 3: Enable Authentication

1. Go to "Authentication" → "Sign-in method"
2. Click "Get started" if needed
3. Keep this tab open - we'll return after Azure AD setup

### Step 4: Get Firebase Config

1. Go to Project Settings (gear icon) → "General"
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app (nickname: "Secret Santa Web")
4. Copy the config values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### Step 5: Initialize Firebase in Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase (in project directory)
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting

# Firestore:
# - Use existing firestore.rules
# - Use existing firestore.indexes.json

# Functions:
# - Language: TypeScript
# - Use ESLint: No
# - Install dependencies: Yes

# Hosting:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No
```

---

## Azure AD Setup

### Step 1: Register Application

1. Go to https://portal.azure.com/
2. Navigate to "Azure Active Directory"
3. Click "App registrations" → "New registration"

### Step 2: Configure Application

**Name**: Secret Santa App
**Supported account types**: 
- "Accounts in this organizational directory only" (Single tenant)

**Redirect URI**:
- Platform: Web
- URI: `https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/handler`
  
  Replace `YOUR-PROJECT-ID` with your actual Firebase project ID
  
  Example: `https://secret-santa-abc123.firebaseapp.com/__/auth/handler`

Click "Register"

### Step 3: Get Application Credentials

After registration, you'll see the Overview page.

**Copy these values:**
1. **Application (client) ID** - example: `12345678-1234-1234-1234-123456789abc`
2. **Directory (tenant) ID** - example: `87654321-4321-4321-4321-cba987654321`

### Step 4: Create Client Secret

1. Click "Certificates & secrets" in left menu
2. Click "New client secret"
3. Description: "Secret Santa App"
4. Expires: 24 months (or as per your policy)
5. Click "Add"
6. **IMMEDIATELY COPY THE VALUE** - you won't see it again!

### Step 5: Configure API Permissions (Optional)

1. Click "API permissions" in left menu
2. Default permissions should be sufficient:
   - Microsoft Graph → User.Read

### Step 6: Connect Azure AD to Firebase

1. Return to Firebase Console → Authentication → Sign-in method
2. Find "Microsoft" and click the pencil icon (Edit)
3. Toggle "Enable"
4. Enter:
   - **Web SDK configuration → Application (client) ID**: Paste from Azure
   - **Web SDK configuration → Client secret**: Paste the secret value from Azure
5. Copy the callback URL shown in Firebase
6. Click "Save"

### Step 7: Verify Redirect URI in Azure

1. Back in Azure Portal → Your app → "Authentication"
2. Verify the Firebase callback URL is listed under "Redirect URIs"
3. If not, add it:
   - Platform: Web
   - Redirect URI: The callback URL from Firebase

---

## SendGrid Setup

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com/
2. Sign up for a free account (40,000 emails/month free for 30 days, then 100/day free)
3. Verify your email address

### Step 2: Verify Sender Identity

**Option A: Single Sender Verification (Quick)**
1. In SendGrid Dashboard → Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in your details:
   - From Name: "Secret Santa"
   - From Email: Your verified email (e.g., noreply@yourdomain.com)
   - Reply To: Same or support email
4. Verify the confirmation email

**Option B: Domain Authentication (Professional)**
1. Settings → Sender Authentication → "Authenticate Your Domain"
2. Follow DNS record instructions for your domain

### Step 3: Create API Key

1. Settings → API Keys → "Create API Key"
2. Name: "Secret Santa App"
3. Permissions: "Restricted Access"
4. Enable only: "Mail Send" → "Full Access"
5. Click "Create & View"
6. **COPY THE API KEY IMMEDIATELY** - you won't see it again!

---

## Local Development

### Step 1: Install Dependencies

```bash
# In project root
npm install

# In functions directory
cd functions
npm install
cd ..
```

### Step 2: Configure Environment Variables

**Frontend (.env)**

Create `.env` in project root:

```env
# From Firebase Project Settings
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Your company settings
VITE_ALLOWED_DOMAIN=ineight.com
VITE_COMPANY_NAME=INE

# Local development
VITE_APP_URL=http://localhost:3000
```

**Backend (Firebase Functions)**

Set environment config for Firebase:

```bash
# From SendGrid
firebase functions:config:set sendgrid.api_key="SG.xxx"
firebase functions:config:set sendgrid.from_email="noreply@yourdomain.com"
firebase functions:config:set sendgrid.from_name="Secret Santa"

# App configuration
firebase functions:config:set app.url="http://localhost:3000"
firebase functions:config:set app.support_email="support@yourdomain.com"
firebase functions:config:set app.allowed_domain="ineight.com"
```

For local development, also create `functions/.runtimeconfig.json`:

```json
{
  "sendgrid": {
    "api_key": "SG.xxx",
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

### Step 3: Deploy Firestore Rules

```bash
firebase deploy --only firestore
```

### Step 4: Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Functions:**
```bash
cd functions
npm run serve
```

Visit http://localhost:3000

---

## Production Deployment

### Step 1: Update Environment Variables

Update `.env` with production URLs:

```env
VITE_APP_URL=https://your-project.web.app
```

Update Firebase Functions config:

```bash
firebase functions:config:set app.url="https://your-project.web.app"
```

### Step 2: Build Frontend

```bash
npm run build
```

This creates a `dist` folder with optimized production build.

### Step 3: Deploy to Firebase

**Deploy Everything:**
```bash
firebase deploy
```

**Or deploy separately:**

```bash
# Hosting only
firebase deploy --only hosting

# Functions only
firebase deploy --only functions

# Firestore rules only
firebase deploy --only firestore
```

### Step 4: Get Deployed URL

After deployment, you'll see:

```
✔  Deploy complete!

Hosting URL: https://your-project.web.app
```

### Step 5: Update Azure Redirect URI for Production

1. Go to Azure Portal → Your App → Authentication
2. Add production redirect URI:
   - Platform: Web
   - Redirect URI: `https://your-project.firebaseapp.com/__/auth/handler`

---

## Verification

### Test Authentication

1. Visit your deployed app or http://localhost:3000
2. Click "Sign in with Microsoft"
3. Should redirect to Microsoft login
4. Sign in with company account
5. Should redirect back to app dashboard

### Test Event Creation

1. After signing in, click "Create Event"
2. Fill in event details
3. Click "Create Event"
4. Should see event in dashboard

### Test Joining Event

1. Open event from dashboard
2. Copy join link
3. Open in incognito/different browser
4. Sign in with different company account
5. Should join event successfully

### Test Draw & Emails

1. Have at least 3 participants join
2. As organizer, click "Perform Secret Santa Draw"
3. Confirm the draw
4. Check email inboxes - each participant should receive assignment
5. Verify assignment visible in app

### Check Firebase Functions Logs

```bash
firebase functions:log
```

Look for:
- Successful draw execution
- Email sending confirmations
- Any errors

---

## Common Issues

### Issue: "Invalid redirect URI"
**Solution**: Verify Azure redirect URI exactly matches Firebase callback URL

### Issue: "Domain not allowed"
**Solution**: 
1. Check `.env` has correct `VITE_ALLOWED_DOMAIN`
2. Check `firestore.rules` has correct domain pattern
3. Rebuild frontend: `npm run build`

### Issue: Emails not sending
**Solution**:
1. Verify SendGrid API key in Firebase config
2. Check sender email is verified in SendGrid
3. Check Functions logs for errors

### Issue: Functions deployment fails
**Solution**:
1. Ensure you're on Blaze (pay-as-you-go) plan for Functions
2. Check `functions/package.json` engines matches your Node version

---

## Next Steps

- [ ] Set up custom domain in Firebase Hosting
- [ ] Configure domain authentication in SendGrid
- [ ] Set up monitoring and alerts
- [ ] Add more admins in Firebase Console
- [ ] Customize email templates
- [ ] Set up CI/CD with GitHub Actions

---

## Support

If you encounter issues:
1. Check Firebase Console → Functions logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure all services (Firebase, Azure, SendGrid) are properly configured

For detailed debugging, enable debug mode:

```javascript
// In firebase.ts
import { setLogLevel } from 'firebase/app';
setLogLevel('debug');
```

---

Happy Secret Santa organizing! 🎅🎁

