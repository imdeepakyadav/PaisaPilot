"use client";

import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  Bell,
  ChevronRight,
  DollarSign,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Tag,
  User,
} from "lucide-react-native";
import type React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors, isDark, theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to log out",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>{icon}</View>
      <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.settingRightContainer}>
        {rightElement ||
          (onPress && (
            <ChevronRight size={20} color={colors.text} opacity={0.5} />
          ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>

          {renderSettingItem(
            <User size={20} color={colors.primary} />,
            "Account Settings",
            () => navigation.navigate("AccountSettings")
          )}

          {renderSettingItem(
            <LogOut size={20} color={colors.error} />,
            "Logout",
            handleLogout
          )}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>

          {renderSettingItem(
            isDark ? (
              <Moon size={20} color={colors.primary} />
            ) : (
              <Sun size={20} color={colors.primary} />
            ),
            "Dark Mode",
            undefined,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          )}

          {renderSettingItem(
            <DollarSign size={20} color={colors.primary} />,
            "Currency",
            () => {
              // Currency selection would be implemented in a real app
              Toast.show({
                type: "info",
                text1: "Currency selection",
                text2: "This feature would be implemented in a real app",
              });
            },
            <Text style={{ color: colors.text, opacity: 0.7 }}>USD</Text>
          )}

          {renderSettingItem(
            <Globe size={20} color={colors.primary} />,
            "Language",
            () => {
              // Language selection would be implemented in a real app
              Toast.show({
                type: "info",
                text1: "Language selection",
                text2: "This feature would be implemented in a real app",
              });
            },
            <Text style={{ color: colors.text, opacity: 0.7 }}>English</Text>
          )}

          {renderSettingItem(
            <Bell size={20} color={colors.primary} />,
            "Notifications",
            () => {
              // Notification settings would be implemented in a real app
              Toast.show({
                type: "info",
                text1: "Notification settings",
                text2: "This feature would be implemented in a real app",
              });
            }
          )}
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Data Management
          </Text>

          {renderSettingItem(
            <Tag size={20} color={colors.primary} />,
            "Manage Categories",
            () => navigation.navigate("CategoryManagement")
          )}
        </View>

        {/* Help & Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Help & Support
          </Text>

          {renderSettingItem(
            <HelpCircle size={20} color={colors.primary} />,
            "Help Center",
            () => {
              // Help center would be implemented in a real app
              Toast.show({
                type: "info",
                text1: "Help Center",
                text2: "This feature would be implemented in a real app",
              });
            }
          )}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text
            style={[styles.appVersion, { color: colors.text, opacity: 0.5 }]}
          >
            Expense Tracker v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    alignItems: "center",
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
  },
  settingRightContainer: {
    marginLeft: 8,
  },
  appInfo: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  appVersion: {
    fontSize: 14,
  },
});
