import { Bot, Send, TrendingUp, User, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useAIAssistant,
  type ChatMessage,
} from "../contexts/AIAssistantContext";
import { useTheme } from "../contexts/ThemeContext";

interface AIChatProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIChat({ visible, onClose }: AIChatProps) {
  const { colors } = useTheme();
  const { chatHistory, isLoading, sendMessage, analyzeExpenses } =
    useAIAssistant();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatHistory.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleAnalyzeExpenses = async () => {
    await sendMessage("Please analyze my expenses and provide suggestions.");
    const suggestions = await analyzeExpenses();
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
        ]}
      >
        <View
          style={[
            styles.messageHeader,
            { alignSelf: isUser ? "flex-end" : "flex-start" },
          ]}
        >
          {isUser ? (
            <User size={16} color={colors.text} />
          ) : (
            <Bot size={16} color={colors.primary} />
          )}
          <Text style={[styles.messageRole, { color: colors.text }]}>
            {isUser ? "You" : "Pilot"}
          </Text>
        </View>
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? colors.primary : colors.card,
              alignSelf: isUser ? "flex-end" : "flex-start",
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? "#fff" : colors.text },
            ]}
          >
            {item.content}
          </Text>
        </View>
        <Text style={[styles.messageTime, { color: colors.secondary }]}>
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.headerLeft}>
            <Bot size={24} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Pilot AI Assistant
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.quickActionButton, { borderColor: colors.border }]}
            onPress={handleAnalyzeExpenses}
          >
            <TrendingUp size={16} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Analyze Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.secondary }]}>
              Pilot is thinking...
            </Text>
          </View>
        )}

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask Pilot about your finances..."
            placeholderTextColor={colors.secondary}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === "ios" ? 44 : 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  assistantMessage: {
    alignSelf: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 12,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
