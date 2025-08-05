"use client";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Calculator,
  Home,
  PieChart,
  Plus,
  Settings,
} from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

// Screens
import AccountSettingsScreen from "../screens/main/AccountSettingsScreen";
import AddExpenseScreen from "../screens/main/AddExpenseScreen";
import CategoryManagementScreen from "../screens/main/CategoryManagementScreen";
import DashboardScreen from "../screens/main/DashboardScreen";
import EditTransactionScreen from "../screens/main/EditTransactionScreen";
import ReportsScreen from "../screens/main/ReportsScreen";
import SettingsScreen from "../screens/main/SettingsScreen";
import ToolsScreen from "../screens/main/ToolsScreen";
import TransactionDetailScreen from "../screens/main/TransactionDetailScreen";
import EMICalculatorScreen from "../screens/main/calculators/EMICalculatorScreen";
import FDCalculatorScreen from "../screens/main/calculators/FDCalculatorScreen";
import SIPCalculatorScreen from "../screens/main/calculators/SIPCalculatorScreen";

const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();
const ReportsStack = createStackNavigator();
const ToolsStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <DashboardStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: "Transaction Details" }}
      />
      <DashboardStack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{ title: "Edit Transaction" }}
      />
    </DashboardStack.Navigator>
  );
}

function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator>
      <ReportsStack.Screen
        name="ReportsMain"
        component={ReportsScreen}
        options={{ headerShown: false }}
      />
    </ReportsStack.Navigator>
  );
}

function ToolsStackNavigator() {
  return (
    <ToolsStack.Navigator>
      <ToolsStack.Screen
        name="ToolsMain"
        component={ToolsScreen}
        options={{ headerShown: false }}
      />
      <ToolsStack.Screen
        name="SIPCalculator"
        component={SIPCalculatorScreen}
        options={{ title: "SIP Calculator" }}
      />
      <ToolsStack.Screen
        name="FDCalculator"
        component={FDCalculatorScreen}
        options={{ title: "FD Calculator" }}
      />
      <ToolsStack.Screen
        name="EMICalculator"
        component={EMICalculatorScreen}
        options={{ title: "EMI Calculator" }}
      />
    </ToolsStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
        options={{ title: "Manage Categories" }}
      />
      <SettingsStack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{ title: "Account Settings" }}
      />
    </SettingsStack.Navigator>
  );
}

export default function MainNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? "#888" : "#666",
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
          title: "Add Transaction",
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <PieChart color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Calculator color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
