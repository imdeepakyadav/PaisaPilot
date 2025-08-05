"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date(),
        settings: {
          currency: "INR",
          language: "en",
          theme: "light",
        },
      });

      // Create default categories
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

      // Successfully registered user
    } catch (error) {
      throw error;
    }
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName: string) => {
    if (user) {
      await updateProfile(user, { displayName });
      // Update the user document in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        { displayName },
        { merge: true }
      );
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
