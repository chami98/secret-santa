# Getting Started with Secret Santa App

Welcome! This guide will help you get the Secret Santa app running quickly.

## 🎯 What You'll Build

A complete web application that allows your company to organize Secret Santa gift exchanges with:
- Microsoft login for authentication
- Random assignment algorithm
- Automatic email notifications
- Mobile-responsive interface

## 📋 Before You Start

You'll need accounts for:
1. **Firebase** (free) - Backend services
2. **Azure AD** (free with Microsoft 365) - Authentication
3. **SendGrid** (free tier available) - Email delivery

## 🚀 Three Ways to Get Started

### Option 1: Quick Start (15 minutes)
Best if you already have Firebase/Azure/SendGrid set up.

👉 Follow [QUICKSTART.md](QUICKSTART.md)

### Option 2: Complete Setup (1 hour)
Step-by-step guide from scratch, perfect for first-time setup.

👉 Follow [SETUP.md](SETUP.md)

### Option 3: Just Browse
Want to understand the code first?

👉 Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 📁 Project Structure

```
secret-santa/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth)
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── config/            # Configuration
├── functions/             # Firebase Cloud Functions
│   └── src/
│       ├── draw.ts        # Assignment algorithm
│       ├── email.ts       # Email service
│       └── index.ts       # Functions entry
├── public/                # Static assets
├── firebase.json          # Firebase configuration
├── firestore.rules        # Database security rules
└── package.json          # Dependencies
```

## 🎓 Technology Overview

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Material-UI**: Beautiful, accessible components
- **Vite**: Fast build tool
- **React Router**: Navigation

### Backend
- **Firebase Authentication**: Microsoft OAuth
- **Cloud Firestore**: Real-time database
- **Cloud Functions**: Serverless backend
- **SendGrid**: Email delivery

## 📖 Documentation Index

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| [README.md](README.md) | Complete overview | 10 min |
| [QUICKSTART.md](QUICKSTART.md) | Fast setup | 5 min |
| [SETUP.md](SETUP.md) | Detailed setup | 15 min |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment | 10 min |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Technical details | 15 min |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributing guide | 5 min |

## 🎯 Your First Steps

### 1. Install Node.js
```bash
node --version  # Should be v18 or higher
```
Not installed? Download from [nodejs.org](https://nodejs.org/)

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase --version
```

### 3. Clone and Install
```bash
git clone <your-repo-url>
cd secret-santa
npm install
cd functions && npm install && cd ..
```

### 4. Choose Your Path

**New to Firebase?** → Start with [SETUP.md](SETUP.md)
**Have Firebase setup?** → Jump to [QUICKSTART.md](QUICKSTART.md)
**Just want to deploy?** → See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🆘 Need Help?

### Common Questions

**Q: Do I need a paid Firebase account?**
A: No! The free tier is sufficient for development and small teams. For production with many users, consider the Blaze (pay-as-you-go) plan.

**Q: Can I use a different email provider instead of SendGrid?**
A: Yes, but you'll need to modify `functions/src/email.ts`. SendGrid is recommended for reliability.

**Q: Does this work with personal Microsoft accounts?**
A: No, it's designed for organizational accounts (Azure AD). You can modify it for personal accounts by changing the OAuth provider.

**Q: How many participants can I have?**
A: Technically unlimited, but tested with up to 100 participants. The algorithm scales well.

**Q: Is my data secure?**
A: Yes! The app uses Firebase Security Rules, Microsoft OAuth, and email domain validation. Assignments are private.

### Getting Help

- 📖 Read the documentation
- 🐛 Check [common issues](SETUP.md#troubleshooting)
- 💬 Create a GitHub issue
- 📧 Contact your development team

## ✅ Setup Checklist

Track your progress:

- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed
- [ ] Firebase project created
- [ ] Azure AD app registered
- [ ] SendGrid account set up
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Firestore rules deployed
- [ ] App running locally
- [ ] Authentication tested
- [ ] Event creation tested
- [ ] Email sending tested
- [ ] Deployed to production

## 🎉 What's Next?

Once you have the app running:

1. **Customize**: Update company domain, colors, email templates
2. **Test**: Create test events with your team
3. **Deploy**: Push to production for your company
4. **Use**: Organize your Secret Santa!

## 💡 Pro Tips

- **Start Local**: Test everything locally before deploying
- **Use Templates**: Copy `.env.template` to `.env` to get started
- **Check Logs**: Use `firebase functions:log` to debug issues
- **Read Errors**: Error messages usually tell you exactly what's wrong
- **Take Breaks**: Setup can be complex, don't rush!

## 📞 Support

If you're stuck:

1. Check the relevant documentation file
2. Search for error messages online
3. Review Firebase/Azure/SendGrid documentation
4. Create an issue with detailed information

## 🚀 Ready to Start?

Pick your path:

**→ First time?** Go to [SETUP.md](SETUP.md)

**→ Quick start?** Go to [QUICKSTART.md](QUICKSTART.md)

**→ Just deploy?** Go to [DEPLOYMENT.md](DEPLOYMENT.md)

---

Good luck and happy coding! 🎅🎁

Questions? Check the [FAQ section in SETUP.md](SETUP.md#troubleshooting) or create an issue.

