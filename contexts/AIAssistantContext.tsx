import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useExpense } from "./ExpenseContext";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface FinancialSuggestion {
  id: string;
  title: string;
  description: string;
  category: "savings" | "investment" | "budgeting" | "tax";
  priority: "high" | "medium" | "low";
  createdAt: Date;
}

interface AIAssistantContextType {
  chatHistory: ChatMessage[];
  suggestions: FinancialSuggestion[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  analyzeExpenses: () => Promise<FinancialSuggestion[]>;
  getMarketUpdate: () => Promise<string>;
  isPilotVisible: boolean;
  togglePilot: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(
  undefined
);

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error(
      "useAIAssistant must be used within an AIAssistantProvider"
    );
  }
  return context;
};

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { transactions, categories } = useExpense();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<FinancialSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPilotVisible, setIsPilotVisible] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    if (user && chatHistory.length === 0) {
      setChatHistory([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello ${
            user.displayName || "there"
          }! I'm Pilot, your AI financial assistant. I can help you analyze your spending patterns, suggest ways to save money, and provide financial insights. How can I help you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user]);

  const generateSystemPrompt = () => {
    const recentTransactions = transactions.slice(0, 10);
    const categoryNames = categories.map((cat) => cat.name).join(", ");

    return `You are Pilot, an AI financial assistant for PaisaPilot app. You help users manage their finances.
    
User's recent transactions:
${recentTransactions
  .map(
    (t) =>
      `${t.type}: $${t.amount} in ${
        t.category
      } on ${t.date.toLocaleDateString()}`
  )
  .join("\\n")}

Available categories: ${categoryNames}

Provide helpful, personalized financial advice based on their spending patterns. Keep responses concise and actionable.`;
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "_user",
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual OpenAI API call)
      const aiResponse = await simulateAIResponse(message);

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + "_assistant",
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "_error",
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("expense") || lowerMessage.includes("spending")) {
      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return `Based on your recent transactions, you've spent $${totalExpenses.toFixed(
        2
      )} this month. Your top spending categories are Food and Transport. Consider setting a budget for these categories to better control your expenses.`;
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      return "Here are some tips to save money: 1) Track your daily expenses 2) Set a monthly budget 3) Cut unnecessary subscriptions 4) Cook at home more often 5) Use the 50/30/20 budgeting rule. Would you like me to help you create a savings plan?";
    }

    if (lowerMessage.includes("budget")) {
      return "A good budget follows the 50/30/20 rule: 50% for needs (rent, utilities), 30% for wants (entertainment, dining), and 20% for savings and debt payments. Based on your spending patterns, I can help you create a personalized budget. Would you like to start?";
    }

    if (
      lowerMessage.includes("investment") ||
      lowerMessage.includes("invest")
    ) {
      return "For investment advice: 1) Start with emergency fund (3-6 months expenses) 2) Consider SIP in mutual funds 3) Diversify your portfolio 4) Think long-term 5) Consult a financial advisor for personalized advice. Remember, past performance doesn't guarantee future returns.";
    }

    return "I'm here to help with your financial questions! You can ask me about budgeting, saving money, analyzing your expenses, or general financial advice. What would you like to know?";
  };

  const clearChat = () => {
    setChatHistory([
      {
        id: "welcome",
        role: "assistant",
        content: `Hello ${
          user?.displayName || "there"
        }! I'm Pilot, your AI financial assistant. How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
  };

  const analyzeExpenses = async (): Promise<FinancialSuggestion[]> => {
    setIsLoading(true);

    try {
      // Analyze user's spending patterns
      const expensesByCategory = categories
        .map((category) => {
          const categoryExpenses = transactions
            .filter((t) => t.type === "expense" && t.category === category.id)
            .reduce((sum, t) => sum + t.amount, 0);

          return { category: category.name, total: categoryExpenses };
        })
        .sort((a, b) => b.total - a.total);

      const newSuggestions: FinancialSuggestion[] = [];

      // High spending category suggestion
      if (expensesByCategory[0]?.total > 0) {
        newSuggestions.push({
          id: "high_spending_" + Date.now(),
          title: `Reduce ${expensesByCategory[0].category} Spending`,
          description: `You've spent $${expensesByCategory[0].total.toFixed(
            2
          )} on ${
            expensesByCategory[0].category
          } this month. Consider setting a budget limit for this category.`,
          category: "budgeting",
          priority: "high",
          createdAt: new Date(),
        });
      }

      // Savings suggestion
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      if (totalIncome > totalExpenses) {
        const surplus = totalIncome - totalExpenses;
        newSuggestions.push({
          id: "savings_" + Date.now(),
          title: "Start a SIP Investment",
          description: `You have a surplus of $${surplus.toFixed(
            2
          )} this month. Consider investing in a SIP mutual fund for long-term wealth creation.`,
          category: "investment",
          priority: "medium",
          createdAt: new Date(),
        });
      }

      setSuggestions(newSuggestions);
      return newSuggestions;
    } catch (error) {
      console.error("Error analyzing expenses:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketUpdate = async (): Promise<string> => {
    // Simulate market update (replace with actual API)
    const updates = [
      "NSE Nifty is up 0.8% today. Banking stocks are performing well.",
      "RBI maintains repo rate at 6.5%. Good time for fixed deposits.",
      "Gold prices have increased by 2% this week. Consider gold ETFs for portfolio diversification.",
      "IT sector stocks are down 1.2% due to global concerns. Long-term outlook remains positive.",
      "New tax-saving mutual funds launched with attractive returns. ELSS funds showing good performance.",
    ];

    return updates[Math.floor(Math.random() * updates.length)];
  };

  const togglePilot = () => {
    setIsPilotVisible((prev) => !prev);
  };

  const value = {
    chatHistory,
    suggestions,
    isLoading,
    sendMessage,
    clearChat,
    analyzeExpenses,
    getMarketUpdate,
    isPilotVisible,
    togglePilot,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};
