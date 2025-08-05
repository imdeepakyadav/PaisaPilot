# 📊 PaisaPilot

**PaisaPilot** is a smart personal expense manager that helps you track daily, monthly, and yearly spending with ease. Add, edit, and analyze expenses, set budgets, view insightful reports, and stay in control of your finances—anytime, anywhere. Simplify your money journey with **PaisaPilot**!

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-1f425f.svg)](https://expo.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Features

- 🔐 **Authentication**

  - Email/Password Login & Registration
  - Google & Apple Sign-In (optional)
  - Password Recovery

- 🏠 **Dashboard**

  - Total Expenses (Daily, Monthly, Yearly)
  - Top Spending Categories
  - Recent Transactions
  - Quick Add Button

- 📊 **Reports**

  - Filter by Date, Category, Amount
  - Interactive Charts (Pie, Bar, etc.) using `Victory Native`

- ⚙️ **Settings**

  - Currency & Language Preferences
  - Light/Dark Theme Toggle
  - Manage Categories (Default & Custom)
  - Account Settings

- ➕ **Expense Management**

  - Add/Edit/Delete Expenses
  - Categorization (Food, Travel, etc.)
  - Custom Categories with Icons & Colors
  - Notes & Receipt Uploads
  - Recurring Expenses

- 💡 **Advanced Tools**

  - Income Tracking & Expense Comparison
  - Budget Planning with Alerts
  - Offline Support with Local Storage
  - Cloud Sync via Firebase / SQLite
  - Data Export (CSV/PDF)
  - Cross-Device & Cross-Platform Sync
  - Smart Search & Filter Options

- 📱 **User Experience**
  - Smooth Navigation with Bottom Tabs
  - Onboarding Walkthrough for New Users

---

## 📷 Screenshots

> _Coming soon..._

---

## 🛠 Tech Stack

- **Framework:** React Native + Expo
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore / SQLite
- **Charts:** Victory Native
- **Storage:** AsyncStorage / Cloud Firestore
- **Navigation:** React Navigation (Bottom Tabs)
- **Other Tools:** Expo ImagePicker, Context API / Redux

---

## 🔧 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/imdeepakyadav/PaisaPilot.git
cd PaisaPilot
```

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

3. **Run the App**

```bash
npx expo start
```

4. **Set Up Firebase**

- Create a project at [Firebase Console](https://console.firebase.google.com/)
- Add Android/iOS app
- Enable Authentication & Firestore
- Replace Firebase config in `firebaseConfig.js`

---

## 📁 Project Structure

```
PaisaPilot/
│
├── app/
├── assests/
├── components/
            ├── ui/
├── contexts/
├── firebase/
├── hooks/
├── lib/
├── navigation/
├── public/
├── screens/
├── styles/

```

---

## ✨ Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add your message'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Deepak Yadav**

- GitHub: [@imdeepakyadav](https://github.com/imdeepakyadav)
- LinkedIn: [@imdeepakyadav](https://linkedin.com/in/imdeepakyadav)

---

## 📬 Contact

For questions, suggestions, or feedback, feel free to reach out via GitHub Issues or LinkedIn.

---

## 📌 TODOs

- [ ] Integrate Google & Apple sign-in
- [ ] Add onboarding walkthrough
- [ ] Implement budget alert notifications
- [ ] Cloud sync toggle with backup/export options
- [ ] Upload screenshot previews

---

> 🌟 _If you find this project helpful, don't forget to give it a star!_
