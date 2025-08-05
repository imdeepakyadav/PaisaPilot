"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native"
import { useTheme } from "../contexts/ThemeContext"
import type { Transaction, Category } from "../contexts/ExpenseContext"

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onPress: (transaction: Transaction) => void
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, onPress }) => {
  const { colors } = useTheme()

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : colors.primary
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={[styles.transactionItem, { backgroundColor: colors.card }]} onPress={() => onPress(item)}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: item.type === "income" ? colors.success : colors.error,
            opacity: 0.2,
          },
        ]}
      >
        {item.type === "income" ? (
          <ArrowUpRight size={20} color={colors.success} />
        ) : (
          <ArrowDownLeft size={20} color={colors.error} />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.categoryText, { color: colors.text }]}>{getCategoryName(item.category)}</Text>
        <Text style={[styles.dateText, { color: colors.text, opacity: 0.6 }]}>{formatDate(item.date)}</Text>
      </View>

      <Text
        style={[
          styles.amountText,
          {
            color: item.type === "income" ? colors.success : colors.error,
          },
        ]}
      >
        {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text, opacity: 0.6 }]}>No transactions to display</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  listContent: {
    paddingVertical: 8,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    fontSize: 14,
  },
})

export default TransactionList
