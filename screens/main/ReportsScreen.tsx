"use client";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Bot, Calendar } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryPieChart from "../../components/CategoryPieChart";
import { useAIAssistant } from "../../contexts/AIAssistantContext";
import { useExpense } from "../../contexts/ExpenseContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function ReportsScreen() {
  const { colors, isDark } = useTheme();
  const { categories, getDailyTotals, getMonthlyTotals, getTotalsByCategory } =
    useExpense();
  const { togglePilot, analyzeExpenses } = useAIAssistant();

  const screenWidth = Dimensions.get("window").width - 32;

  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState<
    { date: string; income: number; expense: number }[]
  >([]);
  const [monthlyData, setMonthlyData] = useState<
    { month: number; income: number; expense: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { category: string; total: number }[]
  >([]);

  useEffect(() => {
    // Set date range based on selected timeframe
    const now = new Date();
    const start = new Date();

    if (timeframe === "week") {
      start.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      start.setMonth(now.getMonth() - 1);
    } else {
      start.setFullYear(now.getFullYear() - 1);
    }

    setStartDate(start);
    setEndDate(now);
  }, [timeframe]);

  useEffect(() => {
    loadReportData();
  }, [startDate, endDate]);

  const loadReportData = async () => {
    setLoading(true);

    try {
      // Get daily totals
      const dailyTotals = await getDailyTotals(startDate, endDate);
      setDailyData(dailyTotals);

      // Get monthly totals for the current year
      const currentYear = new Date().getFullYear();
      const monthlyTotals = await getMonthlyTotals(currentYear);
      setMonthlyData(monthlyTotals);

      // Get category totals
      const categoryTotals = await getTotalsByCategory(startDate, endDate);
      setCategoryData(categoryTotals);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Prepare data for line chart (income vs expense)
  const prepareLineChartData = () => {
    // Use daily data for week, monthly data for month/year
    if (timeframe === "week") {
      return {
        labels: dailyData.map((item) => item.date.substring(5)), // Format: MM-DD
        datasets: [
          {
            data: dailyData.map((item) => item.income),
            color: () => colors.success,
            strokeWidth: 2,
          },
          {
            data: dailyData.map((item) => item.expense),
            color: () => colors.error,
            strokeWidth: 2,
          },
        ],
        legend: ["Income", "Expenses"],
      };
    } else {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return {
        labels: monthlyData.map((item) => monthNames[item.month]),
        datasets: [
          {
            data: monthlyData.map((item) => item.income),
            color: () => colors.success,
            strokeWidth: 2,
          },
          {
            data: monthlyData.map((item) => item.expense),
            color: () => colors.error,
            strokeWidth: 2,
          },
        ],
        legend: ["Income", "Expenses"],
      };
    }
  };

  // Prepare data for bar chart (net income)
  const prepareBarChartData = () => {
    if (timeframe === "week") {
      return {
        labels: dailyData.map((item) => item.date.substring(5)),
        datasets: [
          {
            data: dailyData.map((item) => item.income - item.expense),
          },
        ],
      };
    } else {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return {
        labels: monthlyData.map((item) => monthNames[item.month]),
        datasets: [
          {
            data: monthlyData.map((item) => item.income - item.expense),
          },
        ],
      };
    }
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
    labelColor: (opacity = 1) =>
      `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
    },
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header and Filter Controls */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Reports</Text>

          <View style={styles.timeframeContainer}>
            {(["week", "month", "year"] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.timeframeButton,
                  {
                    backgroundColor:
                      timeframe === option ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setTimeframe(option)}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    { color: timeframe === option ? "white" : colors.text },
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dateRangeContainer}>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.card }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.dateRangeSeparator, { color: colors.text }]}>
              to
            </Text>

            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.card }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(endDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              maximumDate={endDate}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              minimumDate={startDate}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* AI Analysis Button */}
        <TouchableOpacity
          style={[styles.aiAnalysisButton, { backgroundColor: colors.primary }]}
          onPress={async () => {
            await analyzeExpenses();
            togglePilot();
          }}
        >
          <Bot size={20} color="#fff" />
          <Text style={styles.aiAnalysisText}>Analyze with Pilot</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Income vs Expenses Line Chart */}
            <View
              style={[styles.chartContainer, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Income vs Expenses
              </Text>
              {dailyData.length > 0 ? (
                <LineChart
                  data={prepareLineChartData()}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={[styles.noDataText, { color: colors.text }]}>
                    No data available for selected period
                  </Text>
                </View>
              )}
            </View>

            {/* Net Income Bar Chart */}
            <View
              style={[styles.chartContainer, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Net Income
              </Text>
              {dailyData.length > 0 ? (
                <BarChart
                  data={prepareBarChartData()}
                  width={screenWidth - 32}
                  height={220}
                  fromZero={true}
                  showBarTops={true}
                  showValuesOnTopOfBars={true}
                  yAxisLabel="$"
                  yAxisSuffix=""
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => {
                      return `rgba(${
                        isDark ? "102, 187, 106" : "76, 175, 80"
                      }, ${opacity})`;
                    },
                  }}
                  style={styles.chart}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={[styles.noDataText, { color: colors.text }]}>
                    No data available for selected period
                  </Text>
                </View>
              )}
            </View>

            {/* Spending by Category */}
            <View
              style={[styles.chartContainer, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Spending by Category
              </Text>
              <CategoryPieChart data={categoryData} categories={categories} />
            </View>
          </>
        )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  timeframeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  timeframeText: {
    fontWeight: "500",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
  },
  dateRangeSeparator: {
    marginHorizontal: 8,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 14,
    opacity: 0.7,
  },
  aiAnalysisButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  aiAnalysisText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
