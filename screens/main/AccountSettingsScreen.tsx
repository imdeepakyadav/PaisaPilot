"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { User, Mail, Save } from "lucide-react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import Toast from "react-native-toast-message"

export default function AccountSettingsScreen() {
  const { colors } = useTheme()
  const { user, updateUserProfile, resetPassword } = useAuth()

  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Display name cannot be empty",
      })
      return
    }

    setLoading(true)

    try {
      await updateUserProfile(displayName)
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to update profile",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!user?.email) return

    Alert.alert("Reset Password", "We will send a password reset link to your email. Do you want to continue?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Send Email",
        onPress: async () => {
          setLoading(true)
          try {
            await resetPassword(user.email)
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Password reset email sent. Please check your inbox.",
            })
          } catch (error: any) {
            console.error("Error sending reset email:", error)
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message || "Failed to send reset email",
            })
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>

          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            leftIcon={<User size={20} color={colors.primary} />}
          />

          <Input
            label="Email"
            value={user?.email || ""}
            editable={false}
            leftIcon={<Mail size={20} color={colors.primary} />}
          />

          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            loading={loading}
            leftIcon={<Save size={16} color="white" />}
            style={styles.updateButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>

          <Button title="Reset Password" onPress={handleResetPassword} variant="outline" disabled={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 16,
  },
})
