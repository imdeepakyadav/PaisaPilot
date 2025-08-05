"use client"

import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { useTheme } from "../contexts/ThemeContext"
import type { Category } from "../contexts/ExpenseContext"

interface CategoryPieChartProps {
  data: { category: string; total: number }[]
  categories: Category[]
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, categories }) => {
  const { colors, isDark } = useTheme()
  const screenWidth = Dimensions.get("window").width - 64 // Accounting for padding

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#" + Math.floor(Math.random() * 16777215).toString(16)
  }

  // Format data for pie chart
  const chartData = data.map((item) => ({
    name: getCategoryName(item.category),
    amount: item.total,
    color: getCategoryColor(item.category),
    legendFontColor: colors.text,
    legendFontSize: 12,
  }))

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No expense data to display</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          color: (opacity = 1) => `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  emptyContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
  },
})

export default CategoryPieChart
