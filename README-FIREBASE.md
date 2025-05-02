# Firebase Setup for Mom Microsite

This document explains how to set up Firebase for the Mom Microsite application.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the prompts
3. Name your project (e.g., "mom-microsite")
4. Enable Google Analytics if you want (optional)
5. Click "Create project"

## Step 2: Register your web app

1. In the Firebase console, go to your project
2. Click on the web icon (`</>`) to add a web app
3. Register your app with a nickname (e.g., "mom-microsite-web")
4. (Optional) Set up Firebase Hosting if you want

## Step 3: Get your Firebase configuration

After registering your app, you'll see a Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Update the Firebase configuration

1. Copy your Firebase configuration from the Firebase console
2. Open the file `/lib/firebase.js` in your project
3. Replace the placeholder configuration with your actual Firebase configuration

## Step 5: Set up Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Start in production mode (or test mode if you're just testing)
4. Choose a location close to your users
5. Click "Enable"

## Step 6: Set up Firestore security rules

By default, Firebase will set up rules that either allow anyone to read/write or only authenticated users. For this application, you can use these rules for development:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, you would want to add authentication and more restrictive rules.

## Step 7: Run your application

Your application should now work with Firebase Firestore as the database. You can run it with:

```bash
npm run dev
```

## Data Collections

The application uses the following Firestore collections:

- `tvShows`: TV shows and movies
- `books`: Books and reading materials
- `medicines`: Medications and supplements
- `foods`: Meal ideas and recipes

Each collection stores items with fields specific to that type of data, along with automatic timestamps (`createdAt` and `updatedAt`).

## Advanced: Adding Authentication

If you want to add user authentication later:

1. In the Firebase console, go to "Authentication"
2. Click "Get started"
3. Enable the sign-in methods you want (Email/Password is a good start)
4. Update the security rules to include authentication checks
5. Implement authentication in your application