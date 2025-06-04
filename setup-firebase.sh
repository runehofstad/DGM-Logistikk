#!/bin/bash

echo "🔥 Setting up Firebase Production Environment"
echo "============================================"

PROJECT_ID="dgm-logistikk-prod"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "🔐 Logging in to Firebase..."
firebase login

# Create Firebase project
echo "📁 Creating Firebase project: $PROJECT_ID"
firebase projects:create $PROJECT_ID --display-name "DGM Logistikk"

# Set project as active
firebase use $PROJECT_ID

# Create web app
echo "🌐 Creating web app..."
firebase apps:create web "DGM Logistikk Web" --project $PROJECT_ID

# Get configuration
echo "⚙️  Getting Firebase configuration..."
echo ""
echo "📋 Copy this configuration to your .env.production file:"
echo "======================================================="
firebase apps:sdkconfig web --project $PROJECT_ID

echo ""
echo "🏗️  Creating Firestore database..."
firebase firestore:databases:create --location=europe-west1 --project $PROJECT_ID

echo ""
echo "✅ Firebase project setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the configuration above to .env.production"
echo "2. Go to Firebase Console and enable Authentication providers"
echo "3. Run './deploy.sh' to deploy your application"
echo ""
echo "🌍 Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"