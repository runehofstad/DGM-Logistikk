# Firebase Setup Guide for DGM Logistikk

## 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

## 2. Login to Firebase

```bash
firebase login
```

## 3. Initialize Firebase in the project

Navigate to the project directory and run:

```bash
cd dgm-logistikk
firebase init
```

Select the following options:
- **Which Firebase features?** Select:
  - Firestore
  - Functions (TypeScript)
  - Hosting
  - Storage
  - Emulators

- **Project Setup**: Choose "Create a new project" or select existing
- **Firestore Rules**: Yes, overwrite
- **Firestore indexes**: Yes
- **Functions language**: TypeScript
- **ESLint**: Yes
- **Install dependencies**: Yes
- **Public directory**: `dist` (for Vite)
- **Single-page app**: Yes
- **Automatic builds**: No
- **Emulators**: Select all

## 4. Create Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Go to Project Settings > General
4. Scroll down to "Your apps" and click "Add app" > Web
5. Register your app with a nickname
6. Copy the configuration values

## 5. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 6. Enable Authentication

In Firebase Console:
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Enable "Phone" provider for 2FA

## 7. Deploy Firebase Rules

The security rules are already configured in the project. Deploy them:

```bash
firebase deploy --only firestore:rules
```

## 8. Set up Cloud Functions

Navigate to the functions directory and install dependencies:

```bash
cd functions
npm install @sendgrid/mail
```

Set SendGrid API key:

```bash
firebase functions:config:set sendgrid.key="your-sendgrid-api-key"
```

## 9. Deploy the application

Build the app:

```bash
npm run build
```

Deploy everything:

```bash
firebase deploy
```

Or deploy specific services:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

## 10. Create initial superadmin user

After deploying, you'll need to manually set a user as superadmin in Firestore:

1. Have the user register normally
2. Go to Firebase Console > Firestore
3. Find the user document in `users` collection
4. Change their `role` field to `superadmin`

## 11. Run emulators for local development

```bash
firebase emulators:start
```

This will start all Firebase services locally for development.