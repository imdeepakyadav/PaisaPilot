
# 📱 PaisaPilot Documentation

PaisaPilot is an open-source personal finance management app built using **React Native + Expo**. It helps users manage their expenses, analyze spending patterns, and receive AI-powered financial suggestions. This document outlines all the features and functionality in **Stage 1** and **Stage 2**.

---

## 🚀 Stage 1: Core Expense Management

### 🔐 Authentication
- Secure login and registration (Firebase Auth)
- Google Sign-In support

### 🧾 Expense Tracking
- Add, edit, and delete expenses
- Categorize expenses (e.g., Food, Travel, Bills, etc.)
- Store expenses in Firebase Firestore

### 📊 Dashboard
- Overview of expenses: Daily, Monthly, Yearly
- Total spent, highest category, spending trends

### 📅 Reports & Filters
- Filter expenses by date range and category
- Visualize data via bar and pie charts

### ⚙️ Settings Screen
- Dark/light/system theme selection
- Language preferences (multi-language support)
- Notification preferences
- Logout option

### 🧭 Bottom Navigation
- Navigate easily between Dashboard, Reports, Add Expense, Settings

---

## 🔮 Stage 2: AI & Financial Tools Expansion

### 🤖 AI Financial Assistant – “Pilot”
- Integrated with OpenAI API
- Analyze real user expense data (encrypted)
- Suggest expense reduction ideas
- Recommend savings/investment tips
- Offer daily updates via notification:
  - Indian Stock Market (NSE/BSE)
  - RBI announcements and government policies
  - Tax-saving strategies

### 💬 Smart Assistant UI
- Floating “Pilot” button on all screens
- Tap to open a chat interface with AI assistant
- “Analyze with Pilot” option in the Reports screen

### 📈 Financial Calculators Module
Accessible via the “Tools” tab.

#### SIP Calculator
- Inputs: Monthly investment, interest rate, duration
- Output: Maturity value and interest earned

#### Fixed Deposit (FD) Calculator
- Inputs: Principal, rate, time, compounding frequency
- Output: Interest earned and maturity value

#### EMI Calculator
- Inputs: Loan amount, interest rate, tenure
- Output: EMI amount, total interest, total payable

#### Local History
- Each calculation is saved to local device storage for future reference

---

## 🔐 Pro Mode (Soft Launch)
- AI features and calculators fall under Pro label
- For now, all Pro features are **free** to all users to build engagement
- In future: in-app purchase or Firebase remote config to toggle access

---

## 🛠 Tech Stack

### Frontend
- React Native (Expo)
- Nativewind (Tailwind CSS for RN)
- React Navigation
- React Native Chart Kit or Victory Native

### Backend
- Firebase Auth
- Firebase Firestore
- Firebase Cloud Messaging

### AI Integration
- OpenAI API (for financial chat assistant)

### Storage
- AsyncStorage / MMKV (for offline data & calculator history)

---

## 🤝 Contribution Guide
- Fork this repo
- Clone your fork and run `npm install`
- Start development with `npx expo start`
- Submit pull requests with clear feature/fix description

---

## 📬 Feedback
We welcome all feedback and feature suggestions from users and financial mentors. Drop your thoughts, bug reports, or ideas in GitHub Issues or Discussions.

---

© 2025 PaisaPilot – Made with 💰 and 💻
