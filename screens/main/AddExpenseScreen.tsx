"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Calendar, Camera, X } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { useTheme } from "../../contexts/ThemeContext"
import { useExpense } from "../../contexts/ExpenseContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import Toast from "react-native-toast-message"

export default function AddExpenseScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { categories, addTransaction } = useExpense()

  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"expense" | "income">("expense")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState("")
  const [receiptImage, setReceiptImage] = useState<string | null>(null)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set default category if available
    if (categories.length > 0 && !category) {
      setCategory(categories[0].id)
    }
  }, [categories])

  const handleAddTransaction = async () => {
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid amount",
      })
      return
    }

    if (!category) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a category",
      })
      return
    }

    setLoading(true)

    try {
      await addTransaction(
        {
          amount: Number.parseFloat(amount),
          type,
          category,
          date,
          notes,
          isRecurring,
          recurringFrequency: isRecurring ? recurringFrequency : undefined,
        },
        receiptImage || undefined,
      )

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `${type === "income" ? "Income" : "Expense"} added successfully!`,
      })

      // Reset form
      setAmount("")
      setType("expense")
      setCategory(categories.length > 0 ? categories[0].id : "")
      setDate(new Date())
      setNotes("")
      setReceiptImage(null)
      setIsRecurring(false)
      setRecurringFrequency("monthly")

      // Navigate back to dashboard
      navigation.navigate("Dashboard")
    } catch (error: any) {
      console.error("Error adding transaction:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to add transaction",
      })
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "We need camera roll permission to upload receipts",
      })
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "We need camera permission to take photos",
      })
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri)
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Transaction Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: type === "expense" ? colors.error : colors.card,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
            ]}
            onPress={() => setType("expense")}
          >
            <Text style={[styles.toggleText, { color: type === "expense" ? "white" : colors.text }]}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: type === "income" ? colors.success : colors.card,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            ]}
            onPress={() => setType("income")}
          >
            <Text style={[styles.toggleText, { color: type === "income" ? "white" : colors.text }]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
          leftIcon={<Text style={{ fontSize: 18, color: colors.text }}>$</Text>}
        />

        {/* Category Selector */}
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category === cat.id ? cat.color : colors.card,
                  borderColor: category === cat.id ? cat.color : colors.border,
                },
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={[styles.categoryText, { color: category === cat.id ? "white" : colors.text }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Date Picker */}
        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.card }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}

        {/* Notes Input */}
        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes (optional)"
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: "top" }}
        />

        {/* Receipt Image */}
        <Text style={[styles.label, { color: colors.text }]}>Receipt (optional)</Text>
        <View style={styles.receiptContainer}>
          {receiptImage ? (
            <View style={styles.receiptImageContainer}>
              <Image source={{ uri: receiptImage }} style={styles.receiptImage} resizeMode="cover" />
              <TouchableOpacity
                style={[styles.removeImageButton, { backgroundColor: colors.error }]}
                onPress={() => setReceiptImage(null)}
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.receiptButtonsContainer}>
              <Button
                title="Take Photo"
                onPress={takePhoto}
                variant="outline"
                size="small"
                leftIcon={<Camera size={16} color={colors.primary} />}
                style={{ marginRight: 8 }}
              />
              <Button title="Upload" onPress={pickImage} variant="outline" size="small" />
            </View>
          )}
        </View>

        {/* Recurring Transaction */}
        <View style={styles.recurringContainer}>
          <View style={styles.recurringToggle}>
            <Text style={[styles.label, { color: colors.text }]}>Recurring Transaction</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>

          {isRecurring && (
            <View style={styles.frequencyContainer}>
              {(["daily", "weekly", "monthly", "yearly"] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    {
                      backgroundColor: recurringFrequency === freq ? colors.primary : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setRecurringFrequency(freq)}
                >
                  <Text style={[styles.frequencyText, { color: recurringFrequency === freq ? "white" : colors.text }]}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <Button title="Add Transaction" onPress={handleAddTransaction} loading={loading} style={styles.submitButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  toggleText: {
    fontWeight: "600",
    fontSize: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  categoryContainer: {
    paddingBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
  },
  receiptContainer: {
    marginBottom: 16,
  },
  receiptButtonsContainer: {
    flexDirection: "row",
  },
  receiptImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  receiptImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  recurringContainer: {
    marginBottom: 16,
  },
  recurringToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  frequencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  frequencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: 16,
  },
})
