"use client";

import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../../components/Button";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import Input from "../../components/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter both email and password",
      });
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled by the RootNavigator
    } catch (error: any) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "Please check your credentials and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Expense Tracker
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

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leftIcon={<Lock size={20} color={colors.primary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.text} />
                ) : (
                  <Eye size={20} color={colors.text} />
                )}
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPasswordContainer}
          >
            <Text
              style={[styles.forgotPasswordText, { color: colors.primary }]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.dividerContainer}>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.dividerText, { color: colors.secondary }]}>
              or
            </Text>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          </View>

          <GoogleSignInButton onLoading={setLoading} />

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.text }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
  },
});
