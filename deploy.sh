#!/bin/bash

echo "🚀 Deploying DGM Logistikk to Firebase Production"
echo "================================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Deploy Firestore rules and indexes
echo "🔒 Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy Cloud Functions
echo "⚡ Deploying Cloud Functions..."
firebase deploy --only functions

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Show deployment info
echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌍 Your app is now live at:"
firebase hosting:sites:list

echo ""
echo "📊 Firebase Console:"
echo "https://console.firebase.google.com/project/$(firebase use --current)"

echo ""
echo "🔧 Next steps:"
echo "1. Go to Firebase Console → Authentication → Sign-in method"
echo "2. Enable Email/Password and Phone providers"
echo "3. Register your first user and set them as superadmin in Firestore"