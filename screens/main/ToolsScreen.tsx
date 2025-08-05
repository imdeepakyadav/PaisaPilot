import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  Calculator,
  Clock,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalculator } from "../../contexts/CalculatorContext";
import { useTheme } from "../../contexts/ThemeContext";

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  screen: string;
  isPro: boolean;
}

export default function ToolsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();
  const { loadCalculationHistory } = useCalculator();

  useEffect(() => {
    loadCalculationHistory();
  }, []);

  const tools: ToolCard[] = [
    {
      id: "sip",
      title: "SIP Calculator",
      description: "Calculate returns on systematic investment plans",
      icon: <TrendingUp size={24} color={colors.primary} />,
      screen: "SIPCalculator",
      isPro: true,
    },
    {
      id: "fd",
      title: "FD Calculator",
      description: "Calculate fixed deposit maturity and interest",
      icon: <PiggyBank size={24} color={colors.primary} />,
      screen: "FDCalculator",
      isPro: true,
    },
    {
      id: "emi",
      title: "EMI Calculator",
      description: "Calculate loan EMI and total payable amount",
      icon: <CreditCard size={24} color={colors.primary} />,
      screen: "EMICalculator",
      isPro: true,
    },
  ];

  const renderToolCard = (tool: ToolCard) => (
    <TouchableOpacity
      key={tool.id}
      style={[
        styles.toolCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => navigation.navigate(tool.screen)}
    >
      <View style={styles.toolHeader}>
        <View style={styles.toolIcon}>{tool.icon}</View>
        {tool.isPro && (
          <View style={[styles.proBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.proText}>PRO</Text>
          </View>
        )}
      </View>

      <Text style={[styles.toolTitle, { color: colors.text }]}>
        {tool.title}
      </Text>

      <Text style={[styles.toolDescription, { color: colors.secondary }]}>
        {tool.description}
      </Text>

      <View style={styles.toolFooter}>
        <Calculator size={16} color={colors.secondary} />
        <Text style={[styles.toolFooterText, { color: colors.secondary }]}>
          Free to use
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Financial Tools
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            Pro calculators to help you make better financial decisions
          </Text>
        </View>

        <View style={styles.toolsGrid}>{tools.map(renderToolCard)}</View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.infoHeader}>
            <DollarSign size={20} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Pro Features - Free Launch!
            </Text>
          </View>
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            All Pro features are currently free to use. Start planning your
            finances with our powerful calculators and AI assistant.
          </Text>
        </View>

        <View
          style={[
            styles.comingSoonCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.comingSoonHeader}>
            <Clock size={20} color={colors.secondary} />
            <Text style={[styles.comingSoonTitle, { color: colors.text }]}>
              Coming Soon
            </Text>
          </View>
          <Text style={[styles.comingSoonText, { color: colors.secondary }]}>
            • Tax Calculator{"\n"}• Investment Portfolio Tracker{"\n"}•
            Retirement Planning Calculator{"\n"}• Goal-based SIP Planner
          </Text>
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  toolsGrid: {
    padding: 20,
    paddingTop: 10,
  },
  toolCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  toolFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolFooterText: {
    fontSize: 12,
    marginLeft: 6,
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoonCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  comingSoonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
