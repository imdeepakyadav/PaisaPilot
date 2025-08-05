# 🚀 PaisaPilot Setup Guide

Welcome to PaisaPilot! This guide will help you set up the complete expense management application with all features.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase account
- Android Studio (for Android development) or Xcode (for iOS development)

## 🔧 Installation Steps

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/imdeepakyadav/PaisaPilot.git
cd PaisaPilot
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "PaisaPilot"
3. Enable the following services:
   - **Authentication**: Enable Email/Password and Google Sign-In
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable for receipt uploads

#### Firebase Configuration

1. Go to Project Settings → General → Your apps
2. Add a new app (Web app)
3. Copy the Firebase configuration

### 3. Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your Firebase configuration in `.env`:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Sign-In (Optional)
EXPO_PUBLIC_GOOGLE_SIGN_IN_CLIENT_ID=your_google_client_id

# OpenAI API for AI Assistant (Optional)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Google Sign-In Setup (Optional)

For Google Sign-In functionality:

1. Install the required package:

```bash
npm install @react-native-google-signin/google-signin
```

2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Create OAuth 2.0 credentials for your app
4. Add the client ID to your `.env` file

### 5. OpenAI API Setup (Optional)

For the AI Assistant "Pilot" feature:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file
3. Note: The app works without this - it will use simulated responses

## 🚦 Running the Application

### Development Mode

```bash
# Start the Expo development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Run on Web
npx expo start --web
```

### Production Build

```bash
# Build for production
npx expo build:android
npx expo build:ios
```

## 📱 Features Overview

### ✅ Stage 1 Features (Implemented)

- [x] User Authentication (Email/Password + Google Sign-In)
- [x] Expense/Income Tracking
- [x] Dashboard with Analytics
- [x] Category Management
- [x] Reports with Charts
- [x] Receipt Upload
- [x] Dark/Light Theme
- [x] Settings Management

### ✅ Stage 2 Features (Implemented)

- [x] AI Financial Assistant "Pilot"
- [x] Financial Calculators (SIP, FD, EMI)
- [x] Expense Analysis with AI
- [x] Calculator History
- [x] Pro Features (Free for now)

## 🛠 Project Structure

```
PaisaPilot/
├── app/                    # Next.js app directory
├── assets/                 # Images and static files
├── components/             # Reusable UI components
│   ├── ui/                # Shadcn/ui components
│   ├── AIChat.tsx         # AI Assistant chat interface
│   └── PilotButton.tsx    # Floating AI assistant button
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   ├── ExpenseContext.tsx # Expense management
│   ├── ThemeContext.tsx   # Theme management
│   ├── AIAssistantContext.tsx  # AI assistant
│   └── CalculatorContext.tsx   # Financial calculators
├── firebase/              # Firebase configuration
├── navigation/            # Navigation structure
├── screens/               # App screens
│   ├── auth/             # Authentication screens
│   ├── main/             # Main app screens
│   └── main/calculators/ # Calculator screens
└── styles/               # Global styles
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Firebase Rules**: Set up proper Firestore security rules
3. **API Keys**: Restrict API keys to your app's bundle ID
4. **User Data**: All user data is encrypted and stored securely

## 📊 Database Structure

### Firestore Collections

```javascript
// Users collection
users/{userId} = {
  email: string,
  displayName: string,
  createdAt: timestamp,
  settings: {
    currency: string,
    language: string,
    theme: string
  }
}

// Categories collection
categories/{categoryId} = {
  name: string,
  color: string,
  icon: string,
  userId: string
}

// Transactions collection
transactions/{transactionId} = {
  amount: number,
  type: 'income' | 'expense',
  category: string,
  date: timestamp,
  notes?: string,
  receiptUrl?: string,
  isRecurring: boolean,
  recurringFrequency?: string,
  userId: string,
  createdAt: timestamp
}
```

## 🎨 Customization

### Themes

- Modify `contexts/ThemeContext.tsx` to add custom color schemes
- Update component styles to use theme colors

### Categories

- Default categories are created during user registration
- Users can add/edit/delete categories in Settings

### AI Responses

- Customize AI responses in `contexts/AIAssistantContext.tsx`
- Add OpenAI API integration for real AI responses

## 📱 Platform-Specific Notes

### Android

- Minimum SDK version: 21
- Target SDK version: 33
- Requires Google Play Services for Google Sign-In

### iOS

- Minimum iOS version: 11.0
- Requires Xcode 12+ for building
- App Store review may require privacy policy

### Web

- Fully responsive design
- Works offline with service worker
- PWA-ready for installation

## 🚀 Deployment

### Expo Application Services (EAS)

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Configure EAS:

```bash
eas build:configure
```

3. Build for production:

```bash
eas build --platform android
eas build --platform ios
```

### Firebase Hosting (Web)

```bash
npm run build
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Configuration Error**

   - Ensure all environment variables are set correctly
   - Check Firebase project settings

2. **Build Errors**

   - Clear cache: `npx expo start --clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Google Sign-In Issues**

   - Verify OAuth configuration in Google Cloud Console
   - Check bundle ID matches

4. **Metro Bundle Error**
   - Reset Metro cache: `npx expo start --clear`
   - Check for circular dependencies

### Support

- Create an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🌟 Features Roadmap

### Future Enhancements

- [ ] Multi-currency support
- [ ] Expense budgeting with alerts
- [ ] Data export (CSV, PDF)
- [ ] Expense categorization with ML
- [ ] Family/shared accounts
- [ ] Investment portfolio tracking
- [ ] Cryptocurrency tracking
- [ ] Bill reminders and notifications

---

Made with ❤️ by [Deepak Yadav](https://github.com/imdeepakyadav)

For questions or support, please open an issue on GitHub or contact via LinkedIn.
