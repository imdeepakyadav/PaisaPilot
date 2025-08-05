"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from "react-native"
import { Edit2, Trash2, Plus, X } from "lucide-react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useExpense, type Category } from "../../contexts/ExpenseContext"
import Button from "../../components/Button"
import Toast from "react-native-toast-message"

// Predefined colors for category selection
const COLORS = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
]

export default function CategoryManagementScreen() {
  const { colors, isDark } = useTheme()
  const { categories, addCategory, updateCategory, deleteCategory } = useExpense()

  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const openAddModal = () => {
    setEditingCategory(null)
    setCategoryName("")
    setSelectedColor(COLORS[0])
    setModalVisible(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setSelectedColor(category.color)
    setModalVisible(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Category name cannot be empty",
      })
      return
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryName,
          color: selectedColor,
        })
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Category updated successfully",
        })
      } else {
        await addCategory({
          name: categoryName,
          color: selectedColor,
          icon: "tag", // Default icon
        })
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Category added successfully",
        })
      }
      setModalVisible(false)
    } catch (error) {
      console.error("Error saving category:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save category",
      })
    }
  }

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"? This will not delete transactions in this category.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(category.id)
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Category deleted successfully",
              })
            } catch (error) {
              console.error("Error deleting category:", error)
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete category",
              })
            }
          },
        },
      ],
    )
  }

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={[styles.categoryItem, { backgroundColor: colors.card }]}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />

      <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background }]}
          onPress={() => openEditModal(item)}
        >
          <Edit2 size={16} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background }]}
          onPress={() => handleDeleteCategory(item)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>No categories found. Add your first category!</Text>
        }
      />

      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={openAddModal}>
        <Plus size={24} color="white" />
      </TouchableOpacity>

      {/* Category Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingCategory ? "Edit Category" : "Add Category"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? colors.background : "#F5F5F5",
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Category Name"
              placeholderTextColor={isDark ? "#888" : "#999"}
              value={categoryName}
              onChangeText={setCategoryName}
            />

            <Text style={[styles.colorLabel, { color: colors.text }]}>Select Color</Text>

            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button title="Save" onPress={handleSaveCategory} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 6,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "white",
  },
  modalButtons: {
    flexDirection: "row",
  },
})
