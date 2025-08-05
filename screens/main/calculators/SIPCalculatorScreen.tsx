import { useNavigation } from "@react-navigation/native";
import { History, Save, TrendingUp, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
  useCalculator,
  type SIPCalculation,
} from "../../../contexts/CalculatorContext";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SIPCalculatorScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { calculateSIP, saveSIPCalculation, sipHistory } = useCalculator();

  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [expectedReturns, setExpectedReturns] = useState("12");
  const [timePeriod, setTimePeriod] = useState("10");
  const [result, setResult] = useState<SIPCalculation | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "SIP Calculator",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowHistory(!showHistory)}
          style={{ paddingRight: 16 }}
        >
          <History size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [showHistory]);

  const handleCalculate = () => {
    const monthly = parseFloat(monthlyInvestment);
    const returns = parseFloat(expectedReturns);
    const period = parseFloat(timePeriod);

    if (!monthly || monthly <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter a valid monthly investment amount",
      });
      return;
    }

    if (!returns || returns <= 0 || returns > 50) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter expected returns between 1% and 50%",
      });
      return;
    }

    if (!period || period <= 0 || period > 50) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter time period between 1 and 50 years",
      });
      return;
    }

    const calculation = calculateSIP(monthly, returns, period);
    setResult(calculation);
  };

  const handleSaveCalculation = async () => {
    if (result) {
      await saveSIPCalculation(result);
      Toast.show({
        type: "success",
        text1: "Saved",
        text2: "Calculation saved to history",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderHistoryItem = ({ item }: { item: SIPCalculation }) => (
    <TouchableOpacity
      style={[
        styles.historyItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => {
        setMonthlyInvestment(item.monthlyInvestment.toString());
        setExpectedReturns(item.expectedReturns.toString());
        setTimePeriod(item.timePeriod.toString());
        setResult(item);
        setShowHistory(false);
      }}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          ₹{item.monthlyInvestment.toLocaleString()} × {item.timePeriod} years
        </Text>
        <Text style={[styles.historyDate, { color: colors.secondary }]}>
          {item.calculatedAt.toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.historyResult, { color: colors.primary }]}>
        Maturity: {formatCurrency(item.maturityValue)}
      </Text>
    </TouchableOpacity>
  );

  if (showHistory) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>
            Calculation History
          </Text>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={sipHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.historyList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
              No calculations saved yet
            </Text>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                SIP Calculator
              </Text>
            </View>

            <Text style={[styles.cardDescription, { color: colors.secondary }]}>
              Calculate the future value of your systematic investment plan
            </Text>

            <View style={styles.inputSection}>
              <Input
                label="Monthly Investment (₹)"
                value={monthlyInvestment}
                onChangeText={setMonthlyInvestment}
                placeholder="e.g., 5000"
                keyboardType="numeric"
              />

              <Input
                label="Expected Annual Returns (%)"
                value={expectedReturns}
                onChangeText={setExpectedReturns}
                placeholder="e.g., 12"
                keyboardType="numeric"
              />

              <Input
                label="Time Period (Years)"
                value={timePeriod}
                onChangeText={setTimePeriod}
                placeholder="e.g., 10"
                keyboardType="numeric"
              />
            </View>

            <Button
              title="Calculate"
              onPress={handleCalculate}
              disabled={!monthlyInvestment || !expectedReturns || !timePeriod}
            />
          </View>

          {result && (
            <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
              <View style={styles.resultHeader}>
                <Text style={[styles.resultTitle, { color: colors.text }]}>
                  Calculation Results
                </Text>
                <TouchableOpacity onPress={handleSaveCalculation}>
                  <Save size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Monthly Investment
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {formatCurrency(result.monthlyInvestment)}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Time Period
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {result.timePeriod} years
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Total Investment
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {formatCurrency(result.totalInvestment)}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Expected Returns
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.success }]}>
                    {formatCurrency(result.totalReturns)}
                  </Text>
                </View>

                <View style={[styles.resultItem, styles.mainResult]}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Maturity Value
                  </Text>
                  <Text
                    style={[styles.maturityValue, { color: colors.primary }]}
                  >
                    {formatCurrency(result.maturityValue)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.assumptionCard,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.assumptionTitle, { color: colors.text }]}>
                  Assumptions
                </Text>
                <Text
                  style={[styles.assumptionText, { color: colors.secondary }]}
                >
                  • Returns compounded monthly{"\n"}• Investment made at the
                  beginning of each month{"\n"}• Returns are subject to market
                  risks{"\n"}• Past performance doesn't guarantee future returns
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  resultGrid: {
    gap: 16,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  mainResult: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 16,
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  maturityValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  assumptionCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  assumptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  assumptionText: {
    fontSize: 12,
    lineHeight: 18,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  historyList: {
    padding: 16,
    paddingTop: 0,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 12,
  },
  historyResult: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
  },
});
