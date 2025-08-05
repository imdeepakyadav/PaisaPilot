"use client"

import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { useTheme } from "../contexts/ThemeContext"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { colors } = useTheme()

  // Determine background color based on variant
  const getBackgroundColor = () => {
    if (disabled) return "#CCCCCC"

    switch (variant) {
      case "primary":
        return colors.primary
      case "secondary":
        return colors.secondary
      case "outline":
        return "transparent"
      default:
        return colors.primary
    }
  }

  // Determine text color based on variant
  const getTextColor = () => {
    if (disabled) return "#888888"

    switch (variant) {
      case "primary":
      case "secondary":
        return "#FFFFFF"
      case "outline":
        return colors.primary
      default:
        return "#FFFFFF"
    }
  }

  // Determine border properties based on variant
  const getBorderStyle = () => {
    if (variant === "outline") {
      return {
        borderWidth: 1,
        borderColor: disabled ? "#CCCCCC" : colors.primary,
      }
    }
    return {}
  }

  // Determine padding based on size
  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 }
      case "medium":
        return { paddingVertical: 12, paddingHorizontal: 24 }
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 32 }
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 }
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }, getBorderStyle(), getPadding(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === "small" && { fontSize: 14 },
              size === "large" && { fontSize: 18 },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
})

export default Button
