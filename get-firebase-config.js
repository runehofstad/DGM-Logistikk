#!/usr/bin/env node

console.log(`
🔥 FIREBASE CONFIGURATION SETUP
================================

Run these commands to get your Firebase configuration:

1. Create web app in your Firebase project:
   firebase apps:create web "DGM Logistikk Web App" --project dgm-logistikk-prod

2. Get the configuration:
   firebase apps:sdkconfig web --project dgm-logistikk-prod

3. Copy the config object and update your .env file with the values:

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=dgm-logistikk-prod.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=dgm-logistikk-prod
VITE_FIREBASE_STORAGE_BUCKET=dgm-logistikk-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

4. Enable Authentication providers:
   firebase auth:export --format=csv --project dgm-logistikk-prod

5. Enable Firestore:
   firebase firestore:databases:create --location=europe-west1 --project dgm-logistikk-prod

`);