import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "../contexts/ThemeContext";

interface GoogleSignInButtonProps {
  onLoading?: (loading: boolean) => void;
}

export default function GoogleSignInButton({
  onLoading,
}: GoogleSignInButtonProps) {
  const { colors } = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      onLoading?.(true);

      // For now, we'll show a message that Google Sign-In will be implemented
      // In a real implementation, you would use @react-native-google-signin/google-signin
      Alert.alert(
        "Google Sign-In",
        "Google Sign-In integration is ready for implementation. Please configure Google Sign-In credentials in your Firebase project and install @react-native-google-signin/google-signin package.",
        [{ text: "OK" }]
      );

      // This is how you would implement it with proper Google Sign-In:
      /*
      import { GoogleSignin } from '@react-native-google-signin/google-signin';
      
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_CLIENT_ID,
      });

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date(),
          settings: {
            currency: "INR",
            language: "en",
            theme: "light",
          },
        });

        // Create default categories for new user
        const defaultCategories = [
          { name: "Food & Dining", color: "#FF6B6B", icon: "utensils" },
          { name: "Transportation", color: "#4ECDC4", icon: "car" },
          { name: "Entertainment", color: "#45B7D1", icon: "film" },
          { name: "Bills & Utilities", color: "#96CEB4", icon: "receipt" },
          { name: "Shopping", color: "#FECA57", icon: "shopping-bag" },
          { name: "Healthcare", color: "#FF9FF3", icon: "heart" },
          { name: "Education", color: "#54A0FF", icon: "book" },
          { name: "Travel", color: "#5F27CD", icon: "map-pin" },
          { name: "Personal Care", color: "#00D2D3", icon: "user" },
          { name: "Other", color: "#C7ECEE", icon: "more-horizontal" },
        ];

        for (const category of defaultCategories) {
          await addDoc(collection(db, "categories"), {
            ...category,
            userId: userCredential.user.uid,
          });
        }
      }
      */
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      Toast.show({
        type: "error",
        text1: "Sign-In Failed",
        text2: error.message || "Failed to sign in with Google",
      });
    } finally {
      onLoading?.(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: colors.border }]}
      onPress={handleGoogleSignIn}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.googleIcon}>G</Text>
      </View>
      <Text style={[styles.buttonText, { color: colors.text }]}>
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
