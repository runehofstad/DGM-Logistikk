# 🚀 Firebase Production Setup Guide

This guide will help you deploy DGM Logistikk to Firebase Production using Firebase CLI.

## Prerequisites

- Node.js installed
- Firebase CLI access
- Google account

## Quick Setup (Automated)

Run the automated setup script:

```bash
npm run setup-firebase
```

This will:
1. Install Firebase CLI (if needed)
2. Login to Firebase
3. Create a new Firebase project
4. Create a web app
5. Display configuration values
6. Create Firestore database

## Manual Setup Steps

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Create Firebase Project
```bash
firebase projects:create dgm-logistikk-prod --display-name "DGM Logistikk"
firebase use dgm-logistikk-prod
```

### 4. Initialize Firebase Services
```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Functions  
- ✅ Hosting
- ✅ Storage

### 5. Create Web App
```bash
firebase apps:create web "DGM Logistikk Web" --project dgm-logistikk-prod
```

### 6. Get Configuration
```bash
firebase apps:sdkconfig web --project dgm-logistikk-prod
```

Copy the output to `.env.production` file.

### 7. Create Firestore Database
```bash
firebase firestore:databases:create --location=europe-west1 --project dgm-logistikk-prod
```

## Configuration

### Update .env.production
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=dgm-logistikk-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dgm-logistikk-prod
VITE_FIREBASE_STORAGE_BUCKET=dgm-logistikk-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Deployment

### Full Deployment
```bash
npm run deploy
```

### Partial Deployments
```bash
npm run deploy:hosting    # Deploy only frontend
npm run deploy:functions  # Deploy only Cloud Functions
npm run deploy:firestore  # Deploy only database rules
```

## Post-Deployment Setup

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication → Sign-in method
4. Enable "Email/Password" provider
5. Enable "Phone" provider (for 2FA)

### 2. Create First Superadmin User
1. Register normally on your deployed app
2. Go to Firebase Console → Firestore Database
3. Find your user document in `users` collection
4. Edit the document and change `role` to `"superadmin"`

### 3. Configure SendGrid (Optional)
For email notifications:

```bash
firebase functions:config:set sendgrid.key="your-sendgrid-api-key"
firebase deploy --only functions
```

## Monitoring & Management

### View Logs
```bash
firebase functions:log
```

### Check Deployment Status
```bash
firebase hosting:sites:list
firebase projects:list
```

### Rollback Deployment
```bash
firebase hosting:releases:list
firebase hosting:rollback
```

## Security Checklist

- ✅ Firestore security rules deployed
- ✅ Storage security rules deployed  
- ✅ Authentication providers configured
- ✅ HTTPS enforced (automatic with Firebase Hosting)
- ✅ Environment variables secured

## Troubleshooting

### Common Issues

**Build Errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Permission Errors:**
- Ensure you're logged in: `firebase login`
- Check project ownership in Firebase Console

**Configuration Errors:**
- Verify `.env.production` has correct values
- Check Firebase project ID matches

**Function Deployment Errors:**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## Support

- 📖 [Firebase Documentation](https://firebase.google.com/docs)
- 🆘 [Firebase Support](https://firebase.google.com/support)
- 🐛 [Report Issues](https://github.com/firebase/firebase-tools/issues)