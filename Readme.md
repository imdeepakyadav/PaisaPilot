# 📊 PaisaPilot

**PaisaPilot** is a comprehensive personal finance management app built with **React Native + Expo**. Track expenses, analyze spending patterns, get AI-powered financial advice, and access powerful financial calculators—all in one beautiful, intuitive app.

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-1f425f.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76+-blue.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Features

### 🔐 **Authentication**

- ✅ Email/Password Login & Registration
- ✅ Google Sign-In Integration (Ready)
- ✅ Password Recovery
- ✅ Secure Firebase Authentication

### 🏠 **Dashboard**

- ✅ Real-time expense overview (Daily, Monthly, Yearly)
- ✅ Top spending categories visualization
- ✅ Recent transactions list
- ✅ Quick add transaction button
- ✅ Beautiful charts and analytics

### � **Expense Management**

- ✅ Add/Edit/Delete expenses and income
- ✅ Smart categorization with custom categories
- ✅ Receipt photo upload and storage
- ✅ Recurring expense tracking
- ✅ Notes and descriptions
- ✅ Advanced filtering and search

### 📊 **Reports & Analytics**

- ✅ Interactive charts (Pie, Bar, Line charts)
- ✅ Filter by date range and category
- ✅ Income vs expense analysis
- ✅ Monthly and yearly trends
- ✅ Export capabilities

### 🤖 **AI Financial Assistant - "Pilot"**

- ✅ Intelligent expense analysis
- ✅ Personalized financial advice
- ✅ Spending pattern insights
- ✅ Budget recommendations
- ✅ Chat interface with floating button
- ✅ Market updates and financial tips

### 🧮 **Financial Calculators**

- ✅ **SIP Calculator** - Plan your mutual fund investments
- ✅ **FD Calculator** - Calculate fixed deposit returns
- ✅ **EMI Calculator** - Loan EMI calculations
- ✅ Calculation history and saving
- ✅ Detailed breakdowns and assumptions

### ⚙️ **Settings & Customization**

- ✅ Dark/Light/System theme support
- ✅ Currency preferences (INR default)
- ✅ Category management
- ✅ Account settings
- ✅ Data export options

### 🎨 **User Experience**

- ✅ Beautiful, intuitive UI with smooth animations
- ✅ Bottom tab navigation
- ✅ Responsive design for all screen sizes
- ✅ Offline support with local storage
- ✅ Real-time data synchronization

---

## 📱 Screenshots

<div align="center">
  <img src="./assets/screenshot-dashboard.png" width="200" alt="Dashboard" />
  <img src="./assets/screenshot-ai-chat.png" width="200" alt="AI Assistant" />
  <img src="./assets/screenshot-calculator.png" width="200" alt="Calculators" />
  <img src="./assets/screenshot-reports.png" width="200" alt="Reports" />
</div>

> _Screenshots coming soon..._

---

## 🛠 Tech Stack

### **Frontend**

- **React Native** (0.76+) with Expo SDK
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Chart Kit** for beautiful charts
- **Lucide React Native** for icons
- **React Hook Form** for form management

### **Backend & Services**

- **Firebase Authentication** for secure user management
- **Firebase Firestore** for real-time database
- **Firebase Storage** for receipt images
- **OpenAI API** for AI assistant (optional)

### **State Management**

- **React Context API** for global state
- **AsyncStorage** for local data persistence

### **Styling**

- **NativeWind** (Tailwind CSS for React Native)
- **Custom theme system** with dark/light mode

---

## 🔧 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/imdeepakyadav/PaisaPilot.git
cd PaisaPilot
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Fill in your Firebase configuration in `.env` file.

4. **Start the development server**

```bash
npm start
```

5. **Run on your device**

- Scan QR code with Expo Go app
- Or run `npm run android` / `npm run ios`

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

---

## 📁 Project Structure

```
PaisaPilot/
├── 📱 app/                 # Next.js integration (future web support)
├── 🖼️  assets/              # Images, icons, and static files
├── 🧩 components/          # Reusable UI components
│   ├── ui/                # Shadcn/ui styled components
│   ├── AIChat.tsx         # AI assistant chat interface
│   ├── PilotButton.tsx    # Floating AI button
│   └── ...
├── 🔄 contexts/           # React Context providers
│   ├── AuthContext.tsx    # Authentication management
│   ├── ExpenseContext.tsx # Expense CRUD operations
│   ├── ThemeContext.tsx   # Theme and styling
│   ├── AIAssistantContext.tsx  # AI features
│   └── CalculatorContext.tsx   # Financial calculators
├── 🔥 firebase/           # Firebase configuration
├── 🧭 navigation/         # App navigation structure
├── 📱 screens/            # App screens
│   ├── auth/             # Login, Register, etc.
│   ├── main/             # Dashboard, Reports, etc.
│   └── calculators/      # SIP, FD, EMI calculators
└── 🎨 styles/            # Global styles and themes
```

---

## 🌟 Key Features Deep Dive

### 🤖 AI Financial Assistant "Pilot"

- **Smart Analysis**: Analyzes your spending patterns and provides personalized insights
- **Interactive Chat**: Ask questions about your finances and get instant advice
- **Market Updates**: Get latest financial news and market insights
- **Floating Interface**: Access Pilot from any screen with the floating button
- **Expense Insights**: "Analyze with Pilot" feature in reports for deep expense analysis

### 🧮 Financial Calculators

- **SIP Calculator**: Plan systematic investment plans with detailed projections
- **FD Calculator**: Calculate fixed deposit maturity with different compounding frequencies
- **EMI Calculator**: Loan EMI calculations with amortization details
- **History Management**: Save and revisit your calculations
- **Detailed Results**: Comprehensive breakdowns with assumptions and notes

### 📊 Advanced Analytics

- **Multi-timeframe Analysis**: Daily, weekly, monthly, and yearly views
- **Category Insights**: See where your money goes with beautiful pie charts
- **Trend Analysis**: Track income vs expense trends over time
- **Custom Date Ranges**: Analyze any specific period
- **Visual Reports**: Interactive charts powered by React Native Chart Kit

---

## 🔐 Security & Privacy

- **End-to-End Encryption**: All financial data is securely encrypted
- **Firebase Security**: Industry-standard security with Firebase backend
- **Local Storage**: Sensitive data cached securely on device
- **Privacy First**: No unnecessary data collection
- **Secure Authentication**: Multi-factor authentication support

---

## 🎯 Roadmap

### ✅ **Completed (v1.0)**

- Complete expense management system
- AI financial assistant
- Financial calculators
- Beautiful UI with themes
- Real-time synchronization

### 🔄 **In Progress (v1.1)**

- [ ] Enhanced Google Sign-In integration
- [ ] Advanced budget planning
- [ ] Expense categorization with ML
- [ ] Data export (CSV, PDF)

### 🚀 **Upcoming Features (v2.0)**

- [ ] Multi-currency support
- [ ] Investment portfolio tracking
- [ ] Bill reminders and notifications
- [ ] Family/shared accounts
- [ ] Cryptocurrency tracking
- [ ] Advanced AI insights with real OpenAI integration

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow the existing code style
- Test on both iOS and Android

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Deepak Yadav**

- GitHub: [@imdeepakyadav](https://github.com/imdeepakyadav)
- LinkedIn: [@imdeepakyadav](https://linkedin.com/in/imdeepakyadav)
- Email: contact@imdeepakyadav.com

---

## 🆘 Support

- 📖 [Setup Guide](./SETUP.md)
- 🐛 [Report Issues](https://github.com/imdeepakyadav/PaisaPilot/issues)
- 💬 [Discussions](https://github.com/imdeepakyadav/PaisaPilot/discussions)
- 📧 Email: contact@imdeepakyadav.com

---

## 🌟 Acknowledgments

- **Expo Team** for the amazing development platform
- **Firebase** for backend services
- **React Native Community** for incredible libraries
- **Lucide** for beautiful icons
- **All contributors** who help make PaisaPilot better

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/imdeepakyadav/PaisaPilot?style=social)
![GitHub forks](https://img.shields.io/github/forks/imdeepakyadav/PaisaPilot?style=social)
![GitHub issues](https://img.shields.io/github/issues/imdeepakyadav/PaisaPilot)
![GitHub last commit](https://img.shields.io/github/last-commit/imdeepakyadav/PaisaPilot)

---

<div align="center">
  <h3>💝 If you find PaisaPilot helpful, please give it a ⭐️!</h3>
  <p>Your support motivates us to keep improving and adding new features.</p>
  
  <strong>Made with ❤️ in India 🇮🇳</strong>
</div>
