"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeMode = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeMode
  isDark: boolean
  setTheme: (theme: ThemeMode) => void
  colors: {
    background: string
    card: string
    text: string
    border: string
    primary: string
    secondary: string
    accent: string
    error: string
    success: string
    warning: string
    info: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<ThemeMode>("system")

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme")
        if (savedTheme) {
          setThemeState(savedTheme as ThemeMode)
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error)
      }
    }

    loadTheme()
  }, [])

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    try {
      await AsyncStorage.setItem("theme", newTheme)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  // Determine if dark mode should be active
  const isDark = theme === "system" ? systemColorScheme === "dark" : theme === "dark"

  // Define color palette based on theme
  const colors = {
    background: isDark ? "#121212" : "#FFFFFF",
    card: isDark ? "#1E1E1E" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    border: isDark ? "#2C2C2C" : "#E0E0E0",
    primary: "#6200EE",
    secondary: "#03DAC6",
    accent: isDark ? "#BB86FC" : "#6200EE",
    error: "#CF6679",
    success: "#4CAF50",
    warning: "#FB8C00",
    info: "#2196F3",
  }

  return <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>{children}</ThemeContext.Provider>
}
