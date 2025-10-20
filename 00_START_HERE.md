# 🎅 Secret Santa App - START HERE

## 🎉 Project Complete!

Your complete Secret Santa web application is ready! This is a production-ready, enterprise-grade application with all requested features implemented.

## ✅ What's Been Built

### Core Features
✅ **Microsoft OAuth Authentication** (Azure AD integration)
✅ **Company Domain Validation** (configurable, e.g., @ineight.com)
✅ **Event Creation & Management** (create, join, manage events)
✅ **Smart Assignment Algorithm** (derangement - no self-assignments)
✅ **Email Notifications** (SendGrid integration with beautiful templates)
✅ **Mobile-Responsive UI** (Material-UI, works on all devices)
✅ **Secure Data Access** (Firestore security rules)
✅ **Admin Dashboard** (organizer controls)
✅ **Assignment Privacy** (users only see their own assignment)

### Technical Implementation
✅ React 18 + TypeScript + Vite
✅ Material-UI for components
✅ Firebase (Auth, Firestore, Functions, Hosting)
✅ Cloud Functions for backend logic
✅ SendGrid email integration
✅ Comprehensive documentation
✅ Deployment scripts

## 📁 Project Structure

```
secret-santa/
├── 📄 00_START_HERE.md          ← You are here!
├── 📄 GETTING_STARTED.md        ← Begin here for setup
├── 📄 QUICKSTART.md             ← 15-minute quick start
├── 📄 SETUP.md                  ← Detailed setup guide
├── 📄 DEPLOYMENT.md             ← Production deployment
├── 📄 PROJECT_SUMMARY.md        ← Technical overview
├── 📄 README.md                 ← Complete documentation
├── 📄 CONTRIBUTING.md           ← Contribution guidelines
│
├── 📁 src/                      ← Frontend React app
│   ├── components/              ← UI components
│   ├── pages/                   ← Page components
│   ├── contexts/                ← Auth context
│   ├── services/                ← API services
│   ├── utils/                   ← Utilities
│   └── config/                  ← Firebase config
│
├── 📁 functions/                ← Backend Cloud Functions
│   └── src/
│       ├── index.ts             ← Functions entry
│       ├── draw.ts              ← Draw algorithm
│       ├── email.ts             ← Email service
│       ├── derangement.ts       ← Assignment logic
│       └── types.ts             ← Type definitions
│
├── 📄 firebase.json             ← Firebase configuration
├── 📄 firestore.rules           ← Security rules
├── 📄 package.json              ← Dependencies
└── 📄 vite.config.ts            ← Build config
```

## 🚀 Quick Start (Choose Your Path)

### Path 1: New to Firebase? (1 hour)
Perfect if this is your first time setting up Firebase, Azure AD, or SendGrid.

**→ Go to [SETUP.md](SETUP.md)**

This guide walks you through:
1. Creating Firebase project
2. Setting up Azure AD
3. Configuring SendGrid
4. Running locally
5. Deploying to production

### Path 2: Have Everything Set Up? (15 minutes)
Already have Firebase/Azure/SendGrid accounts configured?

**→ Go to [QUICKSTART.md](QUICKSTART.md)**

This guide covers:
1. Installing dependencies
2. Configuring environment
3. Starting dev servers
4. Testing the app

### Path 3: Just Want to Understand? (30 minutes)
Want to understand the architecture and code first?

**→ Go to [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**

This document covers:
1. Architecture overview
2. Data models
3. Security implementation
4. Component breakdown
5. API design

## 📚 Documentation Guide

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Overview & orientation | First time visiting the project |
| **[QUICKSTART.md](QUICKSTART.md)** | Fast 15-min setup | Have accounts configured |
| **[SETUP.md](SETUP.md)** | Complete setup from scratch | First time setup |
| **[README.md](README.md)** | Full project documentation | Reference guide |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to production | Ready to go live |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Technical deep dive | Understanding the code |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Contribution guidelines | Want to contribute |

## 🎯 What You Need

### Accounts (All Free Tier Available)
1. **Firebase** - Backend services
   - Sign up: https://console.firebase.google.com/
   - Free tier: 50K reads, 20K writes/day

2. **Microsoft Azure** - Authentication
   - Sign up: https://portal.azure.com/
   - Free with Microsoft 365

3. **SendGrid** - Email delivery
   - Sign up: https://sendgrid.com/
   - Free tier: 100 emails/day

### Software
- Node.js 18+ ([download](https://nodejs.org/))
- npm (comes with Node.js)
- Git ([download](https://git-scm.com/))

## 🔧 Installation (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Install functions dependencies
cd functions
npm install
cd ..

# 3. Install Firebase CLI
npm install -g firebase-tools

# 4. Login to Firebase
firebase login
```

## ⚙️ Configuration (10 minutes)

### 1. Copy Environment Templates

```bash
# Frontend environment
cp .env.template .env

# Functions environment
cp functions/.runtimeconfig.template.json functions/.runtimeconfig.json
```

### 2. Fill in Your Values

Edit `.env`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... etc (see .env.template for all fields)
```

Edit `functions/.runtimeconfig.json`:
```json
{
  "sendgrid": {
    "api_key": "YOUR_SENDGRID_API_KEY"
  }
}
```

**Need help getting these values?** → See [SETUP.md](SETUP.md)

## 🏃 Running Locally (2 minutes)

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Functions
cd functions
npm run serve
```

Visit: **http://localhost:3000**

## 🎨 Features Overview

### For Organizers
1. **Create Event** - Set title, minimum participants, budget, date
2. **Share Link** - Copy join link and share with team
3. **Monitor Participants** - See who has joined
4. **Perform Draw** - Click button to randomly assign Secret Santas
5. **Emails Sent** - System automatically emails everyone their assignment

### For Participants
1. **Receive Link** - Get join link from organizer
2. **Sign In** - Use company Microsoft account
3. **Join Event** - Click to join
4. **Add Preferences** - Optional gift ideas/preferences
5. **Receive Assignment** - Get email with Secret Santa assignment
6. **View Online** - Assignment also visible in app

## 🔐 Security Features

✅ **Microsoft OAuth** - Secure company authentication
✅ **Domain Validation** - Only company emails allowed
✅ **Firestore Rules** - Database-level security
✅ **Private Assignments** - Users only see their own
✅ **Organizer Controls** - Only organizer can perform draw
✅ **Audit Logging** - All actions tracked

## 📱 Mobile Support

✅ **Responsive Design** - Works on all screen sizes
✅ **Touch Optimized** - Large tap targets
✅ **Bottom Navigation** - Mobile-friendly nav
✅ **Fast Loading** - Optimized for mobile networks

## 🧪 Testing Checklist

Before deploying to production, test:

- [ ] Sign in with Microsoft account
- [ ] Domain validation blocks wrong emails
- [ ] Create new event
- [ ] Copy and open join link
- [ ] Join event as different user
- [ ] Add gift preferences
- [ ] Perform draw (as organizer)
- [ ] Receive assignment email
- [ ] View assignment in app
- [ ] Test on mobile device

## 📊 Tech Stack Summary

**Frontend:**
- React 18 (UI framework)
- TypeScript (type safety)
- Material-UI (components)
- Vite (build tool)
- React Router (navigation)

**Backend:**
- Firebase Authentication (Microsoft OAuth)
- Cloud Firestore (database)
- Cloud Functions (serverless)
- SendGrid (email)

**Infrastructure:**
- Firebase Hosting (frontend)
- Cloud Functions (backend)
- GitHub (version control)

## 🚀 Deployment

### Quick Deploy
```bash
# Build and deploy everything
npm run build
cd functions && npm run build && cd ..
firebase deploy
```

### First Time Deploy?
See detailed deployment guide: **[DEPLOYMENT.md](DEPLOYMENT.md)**

## 🆘 Troubleshooting

### Can't Sign In?
- Verify Azure redirect URI matches Firebase callback URL
- Check email domain matches VITE_ALLOWED_DOMAIN

### Emails Not Sending?
- Verify SendGrid API key is set
- Check sender email is verified in SendGrid
- View logs: `firebase functions:log`

### Functions Won't Deploy?
- Ensure Firebase project is on Blaze plan
- Run `cd functions && npm run build` to check for errors

**More help:** See troubleshooting in [SETUP.md](SETUP.md#troubleshooting)

## 📞 Getting Help

1. **Check Documentation** - Comprehensive guides for everything
2. **Read Error Messages** - Usually tell you exactly what's wrong
3. **View Logs** - `firebase functions:log` for backend issues
4. **Search Issues** - Check if someone had same problem
5. **Create Issue** - If you're stuck, create a GitHub issue

## 🎓 Learning Path

**Day 1: Setup** (2 hours)
1. Read GETTING_STARTED.md
2. Follow SETUP.md to configure everything
3. Get app running locally

**Day 2: Understanding** (2 hours)
1. Read PROJECT_SUMMARY.md
2. Browse the code
3. Understand data flow

**Day 3: Testing** (1 hour)
1. Test all features locally
2. Create test event with team
3. Verify emails work

**Day 4: Deployment** (1 hour)
1. Follow DEPLOYMENT.md
2. Deploy to production
3. Test production deployment

**Day 5: Usage** (ongoing)
1. Use for actual Secret Santa!
2. Gather feedback
3. Make improvements

## 🎯 Next Steps

1. **→ Read [GETTING_STARTED.md](GETTING_STARTED.md)** for orientation
2. **→ Choose your setup path** (Quick or Complete)
3. **→ Get the app running locally**
4. **→ Test all features**
5. **→ Deploy to production**
6. **→ Organize your Secret Santa!**

## ✨ Key Highlights

**What Makes This Special:**
- ✅ Complete implementation (not a prototype)
- ✅ Production-ready code
- ✅ Enterprise-grade security
- ✅ Beautiful, mobile-friendly UI
- ✅ Comprehensive documentation
- ✅ Easy to customize
- ✅ Scalable architecture

**Ready for:**
- ✅ Small teams (5-10 people)
- ✅ Large teams (100+ people)
- ✅ Multiple concurrent events
- ✅ Company-wide deployment

## 📝 Customization

Easy to customize:
- **Domain**: Change in `.env` and `firestore.rules`
- **Colors**: Edit theme in `src/App.tsx`
- **Email Template**: Modify `functions/src/email.ts`
- **Min Participants**: Configurable per event
- **Company Name**: Change in `.env`

## 🎉 You're Ready!

Everything you need is here:
- ✅ Complete source code
- ✅ Comprehensive documentation
- ✅ Setup guides
- ✅ Deployment scripts
- ✅ Security rules
- ✅ Email templates

**Pick your starting point:**

- 🆕 **New to this?** → [GETTING_STARTED.md](GETTING_STARTED.md)
- ⚡ **Want speed?** → [QUICKSTART.md](QUICKSTART.md)
- 📖 **Need details?** → [SETUP.md](SETUP.md)
- 🚀 **Ready to deploy?** → [DEPLOYMENT.md](DEPLOYMENT.md)
- 🧠 **Want to understand?** → [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 📧 Questions?

**→ Check the relevant documentation file**
**→ Review SETUP.md troubleshooting section**
**→ Create a GitHub issue with details**

---

**Good luck and happy Secret Santa organizing! 🎅🎁**

Built with ❤️ using React, TypeScript, Firebase, and Material-UI

