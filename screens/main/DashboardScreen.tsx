"use client";

import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryPieChart from "../../components/CategoryPieChart";
import DashboardCard from "../../components/DashboardCard";
import TransactionList from "../../components/TransactionList";
import { useAuth } from "../../contexts/AuthContext";
import { useExpense } from "../../contexts/ExpenseContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function DashboardScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    transactions,
    categories,
    loading,
    getTransactionsByDateRange,
    getTotalsByCategory,
  } = useExpense();

  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<"day" | "month" | "year">("month");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState<
    { category: string; total: number }[]
  >([]);

  useEffect(() => {
    loadData();
  }, [timeframe, transactions]);

  const loadData = async () => {
    try {
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate: Date;

      if (timeframe === "day") {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        );
      } else if (timeframe === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
      }

      // Calculate totals from transactions
      let income = 0;
      let expense = 0;

      const filteredTransactions = transactions.filter(
        (t) => t.date >= startDate && t.date <= now
      );

      filteredTransactions.forEach((transaction) => {
        if (transaction.type === "income") {
          income += transaction.amount;
        } else {
          expense += transaction.amount;
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);

      // Get category data for pie chart
      const categoryTotals = await getTotalsByCategory(startDate, now);
      setCategoryData(categoryTotals);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTimeframeLabel = () => {
    const now = new Date();
    if (timeframe === "day") {
      return now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (timeframe === "month") {
      return now.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      return now.getFullYear().toString();
    }
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 5);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hello, {user?.displayName || "User"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Here's your financial summary
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.timeframeButton, { backgroundColor: colors.card }]}
            onPress={() => {
              // Cycle through timeframes
              if (timeframe === "day") setTimeframe("month");
              else if (timeframe === "month") setTimeframe("year");
              else setTimeframe("day");
            }}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.timeframeText, { color: colors.text }]}>
              {getTimeframeLabel()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <DashboardCard
            title="Income"
            value={`$${totalIncome.toFixed(2)}`}
            icon={<TrendingUp size={24} color={colors.success} />}
            backgroundColor={colors.card}
            textColor={colors.text}
          />
          <DashboardCard
            title="Expenses"
            value={`$${totalExpense.toFixed(2)}`}
            icon={<TrendingDown size={24} color={colors.error} />}
            backgroundColor={colors.card}
            textColor={colors.text}
          />
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceTitle}>Current Balance</Text>
          <Text style={styles.balanceValue}>
            ${(totalIncome - totalExpense).toFixed(2)}
          </Text>
        </View>

        {/* Spending by Category */}
        <View
          style={[styles.sectionContainer, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Spending by Category
          </Text>
          <CategoryPieChart data={categoryData} categories={categories} />
        </View>

        {/* Recent Transactions */}
        <View
          style={[styles.sectionContainer, { backgroundColor: colors.card }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to a full transaction list or filter screen
                // This would be implemented in a real app
              }}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <TransactionList
            transactions={getRecentTransactions()}
            categories={categories}
            onPress={(transaction) => {
              navigation.navigate("TransactionDetail", {
                transactionId: transaction.id,
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  timeframeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  timeframeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  balanceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  balanceTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  balanceValue: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  sectionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
  },
});
