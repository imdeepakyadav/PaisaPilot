import { useNavigation } from "@react-navigation/native";
import { History, PiggyBank, Save, X } from "lucide-react-native";
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
  type FDCalculation,
} from "../../../contexts/CalculatorContext";
import { useTheme } from "../../../contexts/ThemeContext";

export default function FDCalculatorScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { calculateFD, saveFDCalculation, fdHistory } = useCalculator();

  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("6.5");
  const [timePeriod, setTimePeriod] = useState("5");
  const [compoundingFrequency, setCompoundingFrequency] = useState("4"); // Quarterly
  const [result, setResult] = useState<FDCalculation | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const compoundingOptions = [
    { label: "Annual", value: 1 },
    { label: "Half-yearly", value: 2 },
    { label: "Quarterly", value: 4 },
    { label: "Monthly", value: 12 },
  ];

  useEffect(() => {
    navigation.setOptions({
      title: "FD Calculator",
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
    const principalAmount = parseFloat(principal);
    const rate = parseFloat(interestRate);
    const period = parseFloat(timePeriod);
    const frequency = parseFloat(compoundingFrequency);

    if (!principalAmount || principalAmount <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter a valid principal amount",
      });
      return;
    }

    if (!rate || rate <= 0 || rate > 20) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter interest rate between 0.1% and 20%",
      });
      return;
    }

    if (!period || period <= 0 || period > 30) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter time period between 0.1 and 30 years",
      });
      return;
    }

    const calculation = calculateFD(principalAmount, rate, period, frequency);
    setResult(calculation);
  };

  const handleSaveCalculation = async () => {
    if (result) {
      await saveFDCalculation(result);
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

  const getCompoundingLabel = (frequency: number) => {
    return (
      compoundingOptions.find((option) => option.value === frequency)?.label ||
      "Quarterly"
    );
  };

  const renderHistoryItem = ({ item }: { item: FDCalculation }) => (
    <TouchableOpacity
      style={[
        styles.historyItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => {
        setPrincipal(item.principal.toString());
        setInterestRate(item.interestRate.toString());
        setTimePeriod(item.timePeriod.toString());
        setCompoundingFrequency(item.compoundingFrequency.toString());
        setResult(item);
        setShowHistory(false);
      }}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          ₹{item.principal.toLocaleString()} @ {item.interestRate}%
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
        <View style={styles.historyHeaderContainer}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>
            Calculation History
          </Text>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={fdHistory}
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
              <PiggyBank size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Fixed Deposit Calculator
              </Text>
            </View>

            <Text style={[styles.cardDescription, { color: colors.secondary }]}>
              Calculate the maturity amount and interest earned on your fixed
              deposit
            </Text>

            <View style={styles.inputSection}>
              <Input
                label="Principal Amount (₹)"
                value={principal}
                onChangeText={setPrincipal}
                placeholder="e.g., 100000"
                keyboardType="numeric"
              />

              <Input
                label="Interest Rate (% per annum)"
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="e.g., 6.5"
                keyboardType="numeric"
              />

              <Input
                label="Time Period (Years)"
                value={timePeriod}
                onChangeText={setTimePeriod}
                placeholder="e.g., 5"
                keyboardType="numeric"
              />

              <Text style={[styles.sectionLabel, { color: colors.text }]}>
                Compounding Frequency
              </Text>
              <View style={styles.compoundingOptions}>
                {compoundingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.compoundingOption,
                      {
                        backgroundColor:
                          parseInt(compoundingFrequency) === option.value
                            ? colors.primary
                            : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() =>
                      setCompoundingFrequency(option.value.toString())
                    }
                  >
                    <Text
                      style={[
                        styles.compoundingOptionText,
                        {
                          color:
                            parseInt(compoundingFrequency) === option.value
                              ? "#fff"
                              : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Calculate"
              onPress={handleCalculate}
              disabled={!principal || !interestRate || !timePeriod}
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
                    Principal Amount
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {formatCurrency(result.principal)}
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
                    Compounding
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>
                    {getCompoundingLabel(result.compoundingFrequency)}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Interest Earned
                  </Text>
                  <Text style={[styles.resultValue, { color: colors.success }]}>
                    {formatCurrency(result.interestEarned)}
                  </Text>
                </View>

                <View style={[styles.resultItem, styles.mainResult]}>
                  <Text
                    style={[styles.resultLabel, { color: colors.secondary }]}
                  >
                    Maturity Amount
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
                  Important Notes
                </Text>
                <Text
                  style={[styles.assumptionText, { color: colors.secondary }]}
                >
                  • Interest rates may vary between banks{"\n"}• TDS applicable
                  if interest exceeds ₹40,000 per year{"\n"}• Premature
                  withdrawal may incur penalty{"\n"}• Senior citizens may get
                  higher interest rates
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 8,
  },
  compoundingOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  compoundingOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  compoundingOptionText: {
    fontSize: 14,
    fontWeight: "500",
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
