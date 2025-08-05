"use client"

import type React from "react"
import { View, TextInput, Text, StyleSheet, type TextInputProps, type ViewStyle } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

interface InputProps extends TextInputProps {
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  containerStyle?: ViewStyle
}

const Input: React.FC<InputProps> = ({ label, leftIcon, rightIcon, error, containerStyle, style, ...props }) => {
  const { colors, isDark } = useTheme()

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? colors.card : "#F5F5F5",
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 16,
              paddingRight: rightIcon ? 0 : 16,
            },
            style,
          ]}
          placeholderTextColor={isDark ? "#888" : "#999"}
          {...props}
        />

        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    overflow: "hidden",
  },
  leftIconContainer: {
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconContainer: {
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
})

export default Input
