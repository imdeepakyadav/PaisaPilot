import { Bot } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAIAssistant } from "../contexts/AIAssistantContext";
import { useTheme } from "../contexts/ThemeContext";

export default function PilotButton() {
  const { colors } = useTheme();
  const { togglePilot } = useAIAssistant();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
        },
      ]}
      onPress={togglePilot}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Bot size={28} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
