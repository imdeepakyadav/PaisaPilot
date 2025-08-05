import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AIChat from "./components/AIChat";
import PilotButton from "./components/PilotButton";
import {
  AIAssistantProvider,
  useAIAssistant,
} from "./contexts/AIAssistantContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CalculatorProvider } from "./contexts/CalculatorContext";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import RootNavigator from "./navigation/RootNavigator";

function AppContent() {
  const { isPilotVisible, togglePilot } = useAIAssistant();

  return (
    <>
      <RootNavigator />
      <PilotButton />
      <AIChat visible={isPilotVisible} onClose={togglePilot} />
      <StatusBar style="auto" />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ExpenseProvider>
              <CalculatorProvider>
                <AIAssistantProvider>
                  <NavigationContainer>
                    <AppContent />
                  </NavigationContainer>
                </AIAssistantProvider>
              </CalculatorProvider>
            </ExpenseProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
