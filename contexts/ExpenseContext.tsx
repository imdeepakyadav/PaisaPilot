"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "../firebase/config"
import { useAuth } from "./AuthContext"

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Transaction {
  id: string
  amount: number
  type: "expense" | "income"
  category: string
  date: Date
  notes?: string
  receiptUrl?: string
  isRecurring: boolean
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly"
  createdAt: Date
}

interface ExpenseContextType {
  transactions: Transaction[]
  categories: Category[]
  loading: boolean
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">, receiptImage?: string) => Promise<void>
  updateTransaction: (
    id: string,
    transaction: Partial<Omit<Transaction, "id" | "createdAt">>,
    receiptImage?: string,
  ) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, "id">) => Promise<void>
  updateCategory: (id: string, category: Partial<Omit<Category, "id">>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Promise<Transaction[]>
  getTransactionsByCategory: (categoryId: string) => Promise<Transaction[]>
  getTotalsByCategory: (startDate: Date, endDate: Date) => Promise<{ category: string; total: number }[]>
  getDailyTotals: (startDate: Date, endDate: Date) => Promise<{ date: string; income: number; expense: number }[]>
  getMonthlyTotals: (year: number) => Promise<{ month: number; income: number; expense: number }[]>
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const useExpense = () => {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Load user's transactions and categories when user changes
  useEffect(() => {
    if (!user) {
      setTransactions([])
      setCategories([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Subscribe to transactions collection
    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
    )

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: data.date.toDate(),
          notes: data.notes,
          receiptUrl: data.receiptUrl,
          isRecurring: data.isRecurring,
          recurringFrequency: data.recurringFrequency,
          createdAt: data.createdAt.toDate(),
        } as Transaction
      })
      setTransactions(transactionsData)
    })

    // Subscribe to categories collection
    const categoriesQuery = query(collection(db, "categories"), where("userId", "==", user.uid))

    const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[]
      setCategories(categoriesData)
      setLoading(false)
    })

    return () => {
      unsubscribeTransactions()
      unsubscribeCategories()
    }
  }, [user])

  const addTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">, receiptImage?: string) => {
    if (!user) return

    let receiptUrl = undefined

    // Upload receipt image if provided
    if (receiptImage) {
      const imageRef = ref(storage, `receipts/${user.uid}/${Date.now()}`)
      const response = await fetch(receiptImage)
      const blob = await response.blob()
      await uploadBytes(imageRef, blob)
      receiptUrl = await getDownloadURL(imageRef)
    }

    await addDoc(collection(db, "transactions"), {
      ...transaction,
      userId: user.uid,
      receiptUrl,
      createdAt: Timestamp.now(),
      date: Timestamp.fromDate(transaction.date),
    })
  }

  const updateTransaction = async (
    id: string,
    transaction: Partial<Omit<Transaction, "id" | "createdAt">>,
    receiptImage?: string,
  ) => {
    if (!user) return

    const transactionRef = doc(db, "transactions", id)
    const updates: any = { ...transaction }

    // Handle date conversion
    if (transaction.date) {
      updates.date = Timestamp.fromDate(transaction.date)
    }

    // Handle receipt image
    if (receiptImage) {
      // Delete old receipt if exists
      const existingTransaction = transactions.find((t) => t.id === id)
      if (existingTransaction?.receiptUrl) {
        try {
          const oldImageRef = ref(storage, existingTransaction.receiptUrl)
          await deleteObject(oldImageRef)
        } catch (error) {
          console.error("Error deleting old receipt:", error)
        }
      }

      // Upload new receipt
      const imageRef = ref(storage, `receipts/${user.uid}/${Date.now()}`)
      const response = await fetch(receiptImage)
      const blob = await response.blob()
      await uploadBytes(imageRef, blob)
      updates.receiptUrl = await getDownloadURL(imageRef)
    }

    await updateDoc(transactionRef, updates)
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return

    // Delete receipt image if exists
    const transaction = transactions.find((t) => t.id === id)
    if (transaction?.receiptUrl) {
      try {
        const imageRef = ref(storage, transaction.receiptUrl)
        await deleteObject(imageRef)
      } catch (error) {
        console.error("Error deleting receipt:", error)
      }
    }

    await deleteDoc(doc(db, "transactions", id))
  }

  const addCategory = async (category: Omit<Category, "id">) => {
    if (!user) return

    await addDoc(collection(db, "categories"), {
      ...category,
      userId: user.uid,
    })
  }

  const updateCategory = async (id: string, category: Partial<Omit<Category, "id">>) => {
    if (!user) return

    const categoryRef = doc(db, "categories", id)
    await updateDoc(categoryRef, category)
  }

  const deleteCategory = async (id: string) => {
    if (!user) return

    await deleteDoc(doc(db, "categories", id))
  }

  const getTransactionsByDateRange = async (startDate: Date, endDate: Date): Promise<Transaction[]> => {
    if (!user) return []

    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      where("date", ">=", startTimestamp),
      where("date", "<=", endTimestamp),
      orderBy("date", "desc"),
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date.toDate(),
        notes: data.notes,
        receiptUrl: data.receiptUrl,
        isRecurring: data.isRecurring,
        recurringFrequency: data.recurringFrequency,
        createdAt: data.createdAt.toDate(),
      } as Transaction
    })
  }

  const getTransactionsByCategory = async (categoryId: string): Promise<Transaction[]> => {
    if (!user) return []

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      where("category", "==", categoryId),
      orderBy("date", "desc"),
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date.toDate(),
        notes: data.notes,
        receiptUrl: data.receiptUrl,
        isRecurring: data.isRecurring,
        recurringFrequency: data.recurringFrequency,
        createdAt: data.createdAt.toDate(),
      } as Transaction
    })
  }

  const getTotalsByCategory = async (startDate: Date, endDate: Date) => {
    const transactions = await getTransactionsByDateRange(startDate, endDate)

    const totals = transactions.reduce(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0
        }

        if (transaction.type === "expense") {
          acc[transaction.category] += transaction.amount
        }

        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(totals).map(([category, total]) => ({
      category,
      total,
    }))
  }

  const getDailyTotals = async (startDate: Date, endDate: Date) => {
    const transactions = await getTransactionsByDateRange(startDate, endDate)

    const dailyTotals: Record<string, { income: number; expense: number }> = {}

    transactions.forEach((transaction) => {
      const dateString = transaction.date.toISOString().split("T")[0]

      if (!dailyTotals[dateString]) {
        dailyTotals[dateString] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        dailyTotals[dateString].income += transaction.amount
      } else {
        dailyTotals[dateString].expense += transaction.amount
      }
    })

    return Object.entries(dailyTotals).map(([date, { income, expense }]) => ({
      date,
      income,
      expense,
    }))
  }

  const getMonthlyTotals = async (year: number) => {
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    const transactions = await getTransactionsByDateRange(startDate, endDate)

    const monthlyTotals: Record<number, { income: number; expense: number }> = {}

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      monthlyTotals[i] = { income: 0, expense: 0 }
    }

    transactions.forEach((transaction) => {
      const month = transaction.date.getMonth()

      if (transaction.type === "income") {
        monthlyTotals[month].income += transaction.amount
      } else {
        monthlyTotals[month].expense += transaction.amount
      }
    })

    return Object.entries(monthlyTotals).map(([month, { income, expense }]) => ({
      month: Number.parseInt(month),
      income,
      expense,
    }))
  }

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        categories,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        getTransactionsByDateRange,
        getTransactionsByCategory,
        getTotalsByCategory,
        getDailyTotals,
        getMonthlyTotals,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}
