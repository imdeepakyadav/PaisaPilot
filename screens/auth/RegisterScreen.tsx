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
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import Toast from "react-native-toast-message"

export default function RegisterScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { register } = useAuth()
  const { colors } = useTheme()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      })
      return
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      })
      return
    }

    setLoading(true)

    try {
      await register(email, password, name)
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully!",
      })
      // Navigation will be handled by the RootNavigator
    } catch (error: any) {
      console.error("Registration error:", error)
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message || "Please try again with different credentials",
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
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
            leftIcon={<User size={20} color={colors.primary} />}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.primary} />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leftIcon={<Lock size={20} color={colors.primary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={colors.text} /> : <Eye size={20} color={colors.text} />}
              </TouchableOpacity>
            }
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leftIcon={<Lock size={20} color={colors.primary} />}
          />

          <Button title="Create Account" onPress={handleRegister} loading={loading} style={styles.registerButton} />

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.text }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  registerButton: {
    marginTop: 20,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    marginRight: 5,
  },
  loginLink: {
    fontWeight: "bold",
  },
})
