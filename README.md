# Secret Santa App

A mobile-first web application for organizing Secret Santa gift exchanges within a company using Microsoft Azure AD authentication, Firebase, and automated email notifications.

## 🎁 Features

- **Microsoft OAuth Authentication**: Secure sign-in using company Azure AD accounts
- **Domain Validation**: Restrict access to specific company email domains (e.g., @ineight.com)
- **Event Management**: Create and manage multiple Secret Santa events
- **Smart Assignment Algorithm**: Automatic random assignment with no self-assignments (derangement)
- **Email Notifications**: Automated emails via SendGrid with assignment details
- **Mobile-First Design**: Fully responsive Material-UI interface
- **Real-time Updates**: Firebase Firestore for instant data synchronization
- **Secure Access Control**: Firestore security rules ensure data privacy

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Firebase SDK** - Authentication & Firestore

### Backend
- **Firebase Cloud Functions** - Serverless backend
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - Microsoft OAuth provider
- **SendGrid** - Email delivery service

### Deployment
- **Firebase Hosting** - Frontend hosting
- **Firebase Functions** - Backend hosting

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm installed
- Firebase CLI installed: `npm install -g firebase-tools`
- A Firebase project created
- An Azure AD application registered
- A SendGrid account with API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd secret-santa
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 3. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database (start in production mode)
4. Enable Firebase Authentication

#### Configure Microsoft OAuth Provider

1. In Firebase Console → Authentication → Sign-in method
2. Enable "Microsoft" provider
3. Note the callback URL (e.g., `https://your-project.firebaseapp.com/__/auth/handler`)

### 4. Azure AD Setup

#### Register Application

1. Go to [Azure Portal](https://portal.azure.com/) → Azure Active Directory
2. Navigate to "App registrations" → "New registration"
3. Fill in:
   - **Name**: Secret Santa App
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Add the Firebase callback URL from step 3
4. Click "Register"

#### Get Credentials

1. On the app overview page, copy:
   - **Application (client) ID**
   - **Directory (tenant) ID**
2. Go to "Certificates & secrets" → "New client secret"
3. Create a secret and copy its **Value** (you won't see it again!)

#### Configure Firebase with Azure Credentials

1. Back in Firebase Console → Authentication → Sign-in method → Microsoft
2. Enter:
   - **Web SDK configuration**: Application (client) ID
   - **Client secret**: The secret value from Azure

### 5. Environment Configuration

#### Frontend Environment

Create `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Company Configuration
VITE_ALLOWED_DOMAIN=ineight.com
VITE_COMPANY_NAME=INE

# App Configuration
VITE_APP_URL=http://localhost:3000
```

#### Functions Environment

Set Firebase Functions environment variables:

```bash
firebase functions:config:set \
  sendgrid.api_key="your_sendgrid_api_key" \
  sendgrid.from_email="noreply@yourdomain.com" \
  sendgrid.from_name="Secret Santa" \
  app.url="https://your-app.web.app" \
  app.support_email="support@yourdomain.com" \
  app.allowed_domain="ineight.com"
```

Or create `functions/.env` for local development:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Secret Santa
APP_URL=http://localhost:3000
SUPPORT_EMAIL=support@yourdomain.com
ALLOWED_DOMAIN=ineight.com
```

### 6. SendGrid Setup

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key with "Mail Send" permissions
3. Verify your sender email address or domain
4. Add the API key to functions environment variables (see above)

### 7. Deploy Firestore Rules & Indexes

```bash
firebase login
firebase init firestore  # Select existing rules and indexes
firebase deploy --only firestore
```

### 8. Run Development Server

```bash
# Frontend
npm run dev

# Functions (in another terminal)
cd functions
npm run serve
```

Visit `http://localhost:3000` to see the app!

## 📦 Deployment

### Deploy Everything

```bash
# Build and deploy frontend + functions
npm run build
firebase deploy
```

### Deploy Frontend Only

```bash
npm run deploy
```

### Deploy Functions Only

```bash
npm run deploy:functions
```

## 🎯 Usage Guide

### For Organizers

1. **Sign In**: Use your company Microsoft account
2. **Create Event**: Click "Create Event" on the dashboard
3. **Share Link**: Copy the join link and share with participants
4. **Monitor Participants**: Watch as people join the event
5. **Perform Draw**: Once enough people have joined, click "Perform Secret Santa Draw"
6. **Emails Sent**: Each participant receives their assignment via email

### For Participants

1. **Receive Invitation**: Get the join link from organizer
2. **Sign In**: Use your company Microsoft account
3. **Join Event**: Click to join the event
4. **Add Preferences** (Optional): Add gift preferences/notes
5. **Wait for Draw**: Organizer will perform the draw
6. **Check Assignment**: View your assignment on the website or in email

## 🔒 Security Features

- **Domain Validation**: Only emails from allowed domain can participate
- **Firestore Security Rules**: Users can only read their own assignments
- **Authentication Required**: All actions require valid authentication
- **Organizer-Only Actions**: Only event organizer can perform draw
- **Secure Email Delivery**: Assignments sent individually, never exposed

## 📁 Project Structure

```
secret-santa/
├── src/
│   ├── components/         # React components
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── CreateEventDialog.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── SignInPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EventPage.tsx
│   │   ├── JoinEventPage.tsx
│   │   └── AssignmentPage.tsx
│   ├── services/           # API services
│   │   ├── eventService.ts
│   │   └── functionService.ts
│   ├── utils/              # Utility functions
│   │   ├── validation.ts
│   │   └── derangement.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── config/             # Configuration
│   │   └── firebase.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── functions/
│   └── src/
│       ├── index.ts        # Functions entry point
│       ├── draw.ts         # Draw algorithm handler
│       ├── derangement.ts  # Assignment algorithm
│       ├── email.ts        # Email service
│       └── types.ts        # TypeScript types
├── public/                 # Static assets
├── firebase.json           # Firebase configuration
├── firestore.rules         # Security rules
├── firestore.indexes.json  # Database indexes
└── package.json
```

## 🗄️ Data Model

### Events Collection
```typescript
events/{eventId}
- title: string
- organizerUid: string
- organizerEmail: string
- companyDomain: string
- createdAt: timestamp
- status: 'open' | 'closed' | 'drawn'
- settings: {
    minParticipants: number
    giftBudget?: string
    deliveryDate?: string
  }
```

### Participants Subcollection
```typescript
events/{eventId}/participants/{userId}
- uid: string
- displayName: string
- email: string
- photoURL?: string
- joinedAt: timestamp
- optOut: boolean
- note?: string
```

### Assignments Subcollection
```typescript
events/{eventId}/assignments/{userId}
- secretSantaUid: string
- recipientUid: string
- recipientName: string
- recipientEmail: string
- recipientNote?: string
- notified: boolean
- notifiedAt?: timestamp
```

## 🔧 Configuration Options

### Change Allowed Domain

Update in `.env`:
```env
VITE_ALLOWED_DOMAIN=yourcompany.com
```

Also update in Firestore rules (`firestore.rules`):
```javascript
function hasAllowedDomain() {
  return request.auth.token.email.matches('.*@yourcompany[.]com$');
}
```

### Customize Email Template

Edit `functions/src/email.ts` to modify the email HTML/text templates.

### Adjust Minimum Participants

When creating an event, you can set the minimum number of participants required.

## 🧪 Testing

### Local Testing

1. Start Firebase Emulators:
```bash
firebase emulators:start
```

2. Update `.env` to point to emulators:
```env
VITE_FIREBASE_AUTH_DOMAIN=localhost:9099
VITE_FIREBASE_FIRESTORE_URL=localhost:8080
```

### Manual Testing Checklist

- [ ] Sign in with Microsoft account
- [ ] Domain validation blocks invalid emails
- [ ] Create new event
- [ ] Copy join link
- [ ] Join event as different user
- [ ] Add gift preferences
- [ ] Perform draw (as organizer)
- [ ] Verify emails received
- [ ] View assignment

## 🐛 Troubleshooting

### Authentication Issues

**Problem**: "Invalid email domain" error
**Solution**: Verify email matches `VITE_ALLOWED_DOMAIN` in `.env`

**Problem**: Microsoft sign-in fails
**Solution**: Check Azure AD redirect URI matches Firebase callback URL

### Email Issues

**Problem**: Emails not sending
**Solution**: 
- Verify SendGrid API key is set
- Check sender email is verified in SendGrid
- Check Firebase Functions logs: `firebase functions:log`

### Deployment Issues

**Problem**: "Error: HTTP Error: 403"
**Solution**: Run `firebase login` and ensure you have owner/editor permissions

## 📝 License

MIT License - Feel free to use this for your organization!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

## ✨ Acceptance Criteria

- ✅ Users can sign in using Microsoft and are blocked if their email is not in the allowed domain
- ✅ Organizer can create an event and share a join link
- ✅ Participants can join after Microsoft login and their profile is stored in Firestore
- ✅ Organizer can run draw only when participants >= minParticipants
- ✅ Draw produces valid derangement (no self-assignments)
- ✅ System sends one email per Secret Santa with recipient details
- ✅ Only organizer can view full assignment map; each user can view only their assignment
- ✅ Mobile UI is responsive (Material-UI breakpoints)
- ✅ All secrets stored in env vars; deployments documented

---

Built with ❤️ for holiday gift exchanges!

#   s e c r e t - s a n t a  
 