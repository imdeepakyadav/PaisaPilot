"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Edit2,
  Trash2,
  Tag,
  FileText,
  Image as ImageIcon,
  Repeat,
} from "lucide-react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useExpense, type Transaction } from "../../contexts/ExpenseContext"
import Button from "../../components/Button"

type RouteParams = {
  transactionId: string
}

export default function TransactionDetailScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>()
  const { colors } = useTheme()
  const { transactions, categories, deleteTransaction } = useExpense()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const transactionId = route.params?.transactionId
    if (transactionId) {
      const foundTransaction = transactions.find((t) => t.id === transactionId)
      if (foundTransaction) {
        setTransaction(foundTransaction)
      } else {
        // Transaction not found, go back
        navigation.goBack()
      }
    }
  }, [route.params, transactions])

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!transaction) return

            setLoading(true)
            try {
              await deleteTransaction(transaction.id)
              navigation.goBack()
            } catch (error) {
              console.error("Error deleting transaction:", error)
              Alert.alert("Error", "Failed to delete transaction")
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading transaction...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Transaction Amount */}
      <View style={[styles.amountContainer, { backgroundColor: colors.card }]}>
        <View style={styles.typeIconContainer}>
          {transaction.type === "income" ? (
            <ArrowUpRight size={24} color={colors.success} />
          ) : (
            <ArrowDownLeft size={24} color={colors.error} />
          )}
        </View>

        <Text
          style={[
            styles.amountText,
            {
              color: transaction.type === "income" ? colors.success : colors.error,
            },
          ]}
        >
          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
        </Text>

        <Text style={[styles.typeText, { color: colors.text }]}>
          {transaction.type === "income" ? "Income" : "Expense"}
        </Text>
      </View>

      {/* Transaction Details */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Calendar size={20} color={colors.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: colors.text, opacity: 0.7 }]}>Date</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatDate(transaction.date)}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Tag size={20} color={colors.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: colors.text, opacity: 0.7 }]}>Category</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{getCategoryName(transaction.category)}</Text>
          </View>
        </View>

        {transaction.notes && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <FileText size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.text, opacity: 0.7 }]}>Notes</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{transaction.notes}</Text>
              </View>
            </View>
          </>
        )}

        {transaction.isRecurring && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Repeat size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.text, opacity: 0.7 }]}>Recurring</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {transaction.recurringFrequency?.charAt(0).toUpperCase() + transaction.recurringFrequency?.slice(1)}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Receipt Image */}
      {transaction.receiptUrl && (
        <View style={[styles.receiptContainer, { backgroundColor: colors.card }]}>
          <View style={styles.receiptHeader}>
            <View style={styles.detailIconContainer}>
              <ImageIcon size={20} color={colors.primary} />
            </View>
            <Text style={[styles.receiptTitle, { color: colors.text }]}>Receipt</Text>
          </View>

          <Image source={{ uri: transaction.receiptUrl }} style={styles.receiptImage} resizeMode="contain" />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate("EditTransaction", { transactionId: transaction.id })}
          variant="outline"
          leftIcon={<Edit2 size={16} color={colors.primary} />}
          style={{ flex: 1, marginRight: 8 }}
        />

        <Button
          title="Delete"
          onPress={handleDelete}
          variant="outline"
          leftIcon={<Trash2 size={16} color={colors.error} />}
          style={{ flex: 1 }}
          textStyle={{ color: colors.error }}
          loading={loading}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
  },
  amountContainer: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  typeText: {
    fontSize: 16,
    opacity: 0.7,
  },
  detailsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  detailIconContainer: {
    width: 40,
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    width: "100%",
  },
  receiptContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  receiptImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 24,
  },
})
