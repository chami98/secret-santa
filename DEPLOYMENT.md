# Deployment Guide

This guide covers deploying the Secret Santa app to production.

## Pre-Deployment Checklist

- [ ] Firebase project created
- [ ] Azure AD app registered with production redirect URIs
- [ ] SendGrid sender verified
- [ ] All environment variables configured
- [ ] Firestore rules tested
- [ ] Frontend builds without errors
- [ ] Functions build without errors

## Environment Configuration

### 1. Production Environment Variables

Update `.env` for production:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_ALLOWED_DOMAIN=ineight.com
VITE_COMPANY_NAME=INE
VITE_APP_URL=https://your-project.web.app
```

### 2. Firebase Functions Configuration

```bash
firebase functions:config:set \
  sendgrid.api_key="YOUR_SENDGRID_API_KEY" \
  sendgrid.from_email="noreply@yourdomain.com" \
  sendgrid.from_name="Secret Santa" \
  app.url="https://your-project.web.app" \
  app.support_email="support@yourdomain.com" \
  app.allowed_domain="ineight.com"
```

## Deployment Steps

### Method 1: Full Deployment (Recommended for first time)

```bash
# 1. Ensure you're logged in
firebase login

# 2. Build frontend
npm run build

# 3. Build functions
cd functions
npm run build
cd ..

# 4. Deploy everything
firebase deploy

# Output:
# ✔ Deploy complete!
# Project Console: https://console.firebase.google.com/project/your-project/overview
# Hosting URL: https://your-project.web.app
```

### Method 2: Incremental Deployment

**Deploy only hosting (frontend):**
```bash
npm run build
firebase deploy --only hosting
```

**Deploy only functions (backend):**
```bash
cd functions && npm run build && cd ..
firebase deploy --only functions
```

**Deploy only Firestore rules:**
```bash
firebase deploy --only firestore:rules
```

**Deploy only Firestore indexes:**
```bash
firebase deploy --only firestore:indexes
```

## Deployment Scripts

Add these scripts to `package.json` for convenience:

```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy:functions": "cd functions && npm run build && cd .. && firebase deploy --only functions",
    "deploy:all": "npm run build && cd functions && npm run build && cd .. && firebase deploy",
    "deploy:rules": "firebase deploy --only firestore:rules"
  }
}
```

## Post-Deployment Verification

### 1. Check Deployment Status

```bash
# View recent deployments
firebase hosting:channel:list

# View functions
firebase functions:list
```

### 2. Test Production App

Visit your production URL and verify:

- [ ] App loads correctly
- [ ] Microsoft sign-in works
- [ ] Can create event
- [ ] Can join event
- [ ] Can perform draw
- [ ] Emails are sent
- [ ] Mobile responsive

### 3. Monitor Functions

```bash
# View live logs
firebase functions:log

# View specific function logs
firebase functions:log --only performDraw
```

### 4. Check Firestore

1. Go to Firebase Console → Firestore Database
2. Verify data structure matches expected schema
3. Test security rules

## Rollback Procedure

### Rollback Hosting

```bash
# List hosting releases
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

### Rollback Functions

Functions don't have automatic rollback. To revert:

```bash
# 1. Checkout previous version from git
git checkout <previous-commit>

# 2. Rebuild and redeploy
cd functions && npm run build && cd ..
firebase deploy --only functions

# 3. Return to latest
git checkout main
```

## Monitoring & Maintenance

### Set Up Monitoring

1. **Firebase Console → Performance**
   - Monitor page load times
   - Track user engagement

2. **Firebase Console → Crashlytics**
   - Enable to track errors

3. **Cloud Functions Logs**
   ```bash
   # Set up log alerts
   firebase functions:log --help
   ```

### Cost Monitoring

1. Go to Firebase Console → Usage and billing
2. Set up budget alerts
3. Monitor:
   - Firestore reads/writes
   - Functions invocations
   - Hosting bandwidth

### Regular Maintenance

**Weekly:**
- [ ] Check error logs
- [ ] Monitor email delivery rates
- [ ] Verify no failed functions

**Monthly:**
- [ ] Review user feedback
- [ ] Check for dependency updates
- [ ] Review costs

**Quarterly:**
- [ ] Rotate SendGrid API keys
- [ ] Review Azure AD app certificates
- [ ] Update dependencies

## Scaling Considerations

### Firestore Limits

- Max 1 write per second per document
- Max 500 concurrent connections per database
- Quota: 50,000 reads, 20,000 writes, 20,000 deletes per day (free tier)

**If hitting limits:**
1. Upgrade to Blaze plan
2. Implement caching
3. Batch writes where possible

### Cloud Functions Limits

- Max 540,000 invocations/month (free tier)
- Max execution time: 540 seconds
- Max memory: 8GB

**If hitting limits:**
1. Upgrade to Blaze plan
2. Optimize function code
3. Implement request throttling

### SendGrid Limits

- Free: 100 emails/day
- Essentials: 40,000 emails/month ($14.95)

## Security Best Practices

### 1. Rotate Secrets Regularly

```bash
# Update SendGrid API key
firebase functions:config:set sendgrid.api_key="NEW_KEY"
firebase deploy --only functions
```

### 2. Review Security Rules

```bash
# Test rules before deploying
firebase emulators:start --only firestore

# In another terminal
npm run test:rules  # (if you have rules tests)
```

### 3. Enable App Check (Optional)

Protect your Firebase resources from abuse:

1. Firebase Console → App Check
2. Enable for your web app
3. Update client code to include App Check SDK

### 4. Set CORS Policies

In `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          }
        ]
      }
    ]
  }
}
```

## CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm ci
          cd functions && npm ci
      
      - name: Build
        run: |
          npm run build
          cd functions && npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Setup Firebase Service Account

1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Add to GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT`

## Troubleshooting Deployments

### Error: "HTTP Error: 403, Forbidden"

**Solution:**
```bash
firebase login --reauth
firebase use --add
firebase deploy
```

### Error: "Functions did not deploy properly"

**Solution:**
```bash
# Check functions build
cd functions
npm run build

# Check for TypeScript errors
npm run lint

# View detailed logs
firebase deploy --only functions --debug
```

### Error: "Hosting deploy failed"

**Solution:**
```bash
# Clear dist and rebuild
rm -rf dist
npm run build

# Check firebase.json hosting config
cat firebase.json
```

### Functions timeout

**Solution:**
Update `functions/src/index.ts`:

```typescript
export const performDraw = functions
  .runWith({ timeoutSeconds: 300, memory: '512MB' })
  .https.onCall(performDrawHandler);
```

## Custom Domain Setup

### 1. Add Custom Domain

1. Firebase Console → Hosting → Add custom domain
2. Enter your domain (e.g., secretsanta.yourcompany.com)
3. Follow DNS verification steps

### 2. Update DNS Records

Add records provided by Firebase:

```
Type: A
Name: secretsanta
Value: 151.101.1.195

Type: A  
Name: secretsanta
Value: 151.101.65.195
```

### 3. Update Environment Variables

```env
VITE_APP_URL=https://secretsanta.yourcompany.com
```

### 4. Update Azure AD

Add redirect URI:
```
https://your-project.firebaseapp.com/__/auth/handler
```

### 5. Redeploy

```bash
npm run deploy:all
```

## Disaster Recovery

### Backup Firestore Data

```bash
# Export to Cloud Storage
gcloud firestore export gs://your-backup-bucket

# Import from Cloud Storage
gcloud firestore import gs://your-backup-bucket/[EXPORT_PREFIX]
```

### Backup Functions Code

- Keep code in version control (Git)
- Tag releases:
  ```bash
  git tag -a v1.0.0 -m "Production release 1.0.0"
  git push origin v1.0.0
  ```

## Support Contacts

- **Firebase Support**: https://firebase.google.com/support
- **SendGrid Support**: https://support.sendgrid.com
- **Azure Support**: https://azure.microsoft.com/support

---

For detailed setup instructions, see [SETUP.md](SETUP.md)

