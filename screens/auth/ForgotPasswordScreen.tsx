"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Mail, ArrowLeft } from "lucide-react-native"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import Toast from "react-native-toast-message"

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { resetPassword } = useAuth()
  const { colors } = useTheme()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email address",
      })
      return
    }

    setLoading(true)

    try {
      await resetPassword(email)
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password reset email sent. Please check your inbox.",
      })
    } catch (error: any) {
      console.error("Password reset error:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send reset email. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.primary} />}
          />

          <Button title="Send Reset Link" onPress={handleResetPassword} loading={loading} style={styles.resetButton} />

          <TouchableOpacity style={styles.loginContainer} onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.loginText, { color: colors.primary }]}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  resetButton: {
    marginTop: 20,
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    fontWeight: "bold",
  },
})
