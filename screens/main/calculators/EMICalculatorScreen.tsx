import { useNavigation } from "@react-navigation/native";
import { CreditCard, History, Save, X } from "lucide-react-native";
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
  type EMICalculation,
} from "../../../contexts/CalculatorContext";
import { useTheme } from "../../../contexts/ThemeContext";

export default function EMICalculatorScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { calculateEMI, saveEMICalculation, emiHistory } = useCalculator();

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [result, setResult] = useState<EMICalculation | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "EMI Calculator",
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
    const loan = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const period = parseFloat(tenure);

    if (!loan || loan <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter a valid loan amount",
      });
      return;
    }

    if (!rate || rate <= 0 || rate > 30) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter interest rate between 0.1% and 30%",
      });
      return;
    }

    if (!period || period <= 0 || period > 50) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter tenure between 0.1 and 50 years",
      });
      return;
    }

    const calculation = calculateEMI(loan, rate, period);
    setResult(calculation);
  };

  const handleSaveCalculation = async () => {
    if (result) {
      await saveEMICalculation(result);
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

  const renderHistoryItem = ({ item }: { item: EMICalculation }) => (
    <TouchableOpacity
      style={[
        styles.historyItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => {
        setLoanAmount(item.loanAmount.toString());
        setInterestRate(item.interestRate.toString());
        setTenure(item.tenure.toString());
        setResult(item);
        setShowHistory(false);
      }}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          ₹{item.loanAmount.toLocaleString()} @ {item.interestRate}%
        </Text>
        <Text style={[styles.historyDate, { color: colors.secondary }]}>
          {item.calculatedAt.toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.historyResult, { color: colors.primary }]}>
        EMI: {formatCurrency(item.emiAmount)}
      </Text>
    </TouchableOpacity>
  );

  if (showHistory) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.historyHeaderContainer}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>
            Calculation History
          </Text>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={emiHistory}
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
              <CreditCard size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                EMI Calculator
              </Text>
            </View>

            <Text style={[styles.cardDescription, { color: colors.secondary }]}>
              Calculate your loan EMI, total interest, and total payable amount
            </Text>

            <View style={styles.inputSection}>
              <Input
                label="Loan Amount (₹)"
                value={loanAmount}
                onChangeText={setLoanAmount}
                placeholder="e.g., 2500000"
                keyboardType="numeric"
              />

              <Input
                label="Interest Rate (% per annum)"
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="e.g., 8.5"
                keyboardType="numeric"
              />

              <Input
                label="Loan Tenure (Years)"
                value={tenure}
                onChangeText={setTenure}
                placeholder="e.g., 20"
                keyboardType="numeric"
              />
            </View>

            <Button
              title="Calculate EMI"
              onPress={handleCalculate}
              disabled={!loanAmount || !interestRate || !tenure}
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
                    Loan Amount
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {formatCurrency(result.loanAmount)}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Interest Rate
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {result.interestRate}% p.a.
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Loan Tenure
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {result.tenure} years ({result.tenure * 12} months)
                  </Text>
                </View>

                <View style={[styles.resultItem, styles.mainResult]}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Monthly EMI
                  </Text>
                  <Text style={[styles.emiValue, { color: colors.primary }]}>
                    {formatCurrency(result.emiAmount)}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Total Interest
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.error }]}>
                    {formatCurrency(result.totalInterest)}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Total Payable
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {formatCurrency(result.totalPayable)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.breakdownCard,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.breakdownTitle, { color: colors.text }]}>
                  Payment Breakdown
                </Text>
                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownRow}>
                    <Text
                      style={[
                        styles.breakdownLabel,
                        { color: colors.secondary },
                      ]}
                    >
                      Principal Amount:
                    </Text>
                    <Text
                      style={[styles.breakdownValue, { color: colors.text }]}
                    >
                      {(
                        (result.loanAmount / result.totalPayable) *
                        100
                      ).toFixed(1)}
                      %
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text
                      style={[
                        styles.breakdownLabel,
                        { color: colors.secondary },
                      ]}
                    >
                      Interest Amount:
                    </Text>
                    <Text
                      style={[styles.breakdownValue, { color: colors.text }]}
                    >
                      {(
                        (result.totalInterest / result.totalPayable) *
                        100
                      ).toFixed(1)}
                      %
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.assumptionCard,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.assumptionTitle, { color: colors.text }]}>
                  Important Notes
                </Text>
                <Text
                  style={[styles.assumptionText, { color: colors.secondary }]}
                >
                  • Interest rates may vary between lenders{"\n"}• Processing
                  fees and other charges not included{"\n"}• Fixed rate assumed
                  for entire tenure{"\n"}• Prepayment can significantly reduce
                  interest burden
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
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 16,
    marginVertical: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  emiValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  breakdownCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  breakdownItem: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 13,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  assumptionCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
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
  historyHeaderContainer: {
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
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
