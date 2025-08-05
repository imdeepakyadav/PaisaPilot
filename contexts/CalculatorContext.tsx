import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

export interface SIPCalculation {
  id: string;
  monthlyInvestment: number;
  expectedReturns: number;
  timePeriod: number;
  maturityValue: number;
  totalInvestment: number;
  totalReturns: number;
  calculatedAt: Date;
}

export interface FDCalculation {
  id: string;
  principal: number;
  interestRate: number;
  timePeriod: number;
  compoundingFrequency: number;
  maturityValue: number;
  interestEarned: number;
  calculatedAt: Date;
}

export interface EMICalculation {
  id: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  totalInterest: number;
  totalPayable: number;
  calculatedAt: Date;
}

interface CalculatorContextType {
  sipHistory: SIPCalculation[];
  fdHistory: FDCalculation[];
  emiHistory: EMICalculation[];
  calculateSIP: (
    monthlyInvestment: number,
    expectedReturns: number,
    timePeriod: number
  ) => SIPCalculation;
  calculateFD: (
    principal: number,
    interestRate: number,
    timePeriod: number,
    compoundingFrequency: number
  ) => FDCalculation;
  calculateEMI: (
    loanAmount: number,
    interestRate: number,
    tenure: number
  ) => EMICalculation;
  saveSIPCalculation: (calculation: SIPCalculation) => Promise<void>;
  saveFDCalculation: (calculation: FDCalculation) => Promise<void>;
  saveEMICalculation: (calculation: EMICalculation) => Promise<void>;
  loadCalculationHistory: () => Promise<void>;
  clearHistory: (type: "sip" | "fd" | "emi") => Promise<void>;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
};

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sipHistory, setSipHistory] = useState<SIPCalculation[]>([]);
  const [fdHistory, setFdHistory] = useState<FDCalculation[]>([]);
  const [emiHistory, setEmiHistory] = useState<EMICalculation[]>([]);

  const calculateSIP = (
    monthlyInvestment: number,
    expectedReturns: number,
    timePeriod: number
  ): SIPCalculation => {
    const monthlyRate = expectedReturns / (12 * 100);
    const totalMonths = timePeriod * 12;

    // SIP formula: M * [((1 + r)^n - 1) / r] * (1 + r)
    const maturityValue = Math.round(
      monthlyInvestment *
        (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
          (1 + monthlyRate))
    );

    const totalInvestment = monthlyInvestment * totalMonths;
    const totalReturns = maturityValue - totalInvestment;

    return {
      id: Date.now().toString(),
      monthlyInvestment,
      expectedReturns,
      timePeriod,
      maturityValue,
      totalInvestment,
      totalReturns,
      calculatedAt: new Date(),
    };
  };

  const calculateFD = (
    principal: number,
    interestRate: number,
    timePeriod: number,
    compoundingFrequency: number
  ): FDCalculation => {
    // Compound Interest formula: A = P(1 + r/n)^(nt)
    const rate = interestRate / 100;
    const maturityValue = Math.round(
      principal *
        Math.pow(
          1 + rate / compoundingFrequency,
          compoundingFrequency * timePeriod
        )
    );

    const interestEarned = maturityValue - principal;

    return {
      id: Date.now().toString(),
      principal,
      interestRate,
      timePeriod,
      compoundingFrequency,
      maturityValue,
      interestEarned,
      calculatedAt: new Date(),
    };
  };

  const calculateEMI = (
    loanAmount: number,
    interestRate: number,
    tenure: number
  ): EMICalculation => {
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenure * 12;

    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiAmount = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );

    const totalPayable = emiAmount * totalMonths;
    const totalInterest = totalPayable - loanAmount;

    return {
      id: Date.now().toString(),
      loanAmount,
      interestRate,
      tenure,
      emiAmount,
      totalInterest,
      totalPayable,
      calculatedAt: new Date(),
    };
  };

  const saveSIPCalculation = async (calculation: SIPCalculation) => {
    const updatedHistory = [calculation, ...sipHistory].slice(0, 50); // Keep only last 50
    setSipHistory(updatedHistory);
    await AsyncStorage.setItem("sip_history", JSON.stringify(updatedHistory));
  };

  const saveFDCalculation = async (calculation: FDCalculation) => {
    const updatedHistory = [calculation, ...fdHistory].slice(0, 50);
    setFdHistory(updatedHistory);
    await AsyncStorage.setItem("fd_history", JSON.stringify(updatedHistory));
  };

  const saveEMICalculation = async (calculation: EMICalculation) => {
    const updatedHistory = [calculation, ...emiHistory].slice(0, 50);
    setEmiHistory(updatedHistory);
    await AsyncStorage.setItem("emi_history", JSON.stringify(updatedHistory));
  };

  const loadCalculationHistory = async () => {
    try {
      const [sipData, fdData, emiData] = await Promise.all([
        AsyncStorage.getItem("sip_history"),
        AsyncStorage.getItem("fd_history"),
        AsyncStorage.getItem("emi_history"),
      ]);

      if (sipData) {
        const parsedSipData = JSON.parse(sipData).map((item: any) => ({
          ...item,
          calculatedAt: new Date(item.calculatedAt),
        }));
        setSipHistory(parsedSipData);
      }

      if (fdData) {
        const parsedFdData = JSON.parse(fdData).map((item: any) => ({
          ...item,
          calculatedAt: new Date(item.calculatedAt),
        }));
        setFdHistory(parsedFdData);
      }

      if (emiData) {
        const parsedEmiData = JSON.parse(emiData).map((item: any) => ({
          ...item,
          calculatedAt: new Date(item.calculatedAt),
        }));
        setEmiHistory(parsedEmiData);
      }
    } catch (error) {
      console.error("Error loading calculation history:", error);
    }
  };

  const clearHistory = async (type: "sip" | "fd" | "emi") => {
    try {
      if (type === "sip") {
        setSipHistory([]);
        await AsyncStorage.removeItem("sip_history");
      } else if (type === "fd") {
        setFdHistory([]);
        await AsyncStorage.removeItem("fd_history");
      } else if (type === "emi") {
        setEmiHistory([]);
        await AsyncStorage.removeItem("emi_history");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const value = {
    sipHistory,
    fdHistory,
    emiHistory,
    calculateSIP,
    calculateFD,
    calculateEMI,
    saveSIPCalculation,
    saveFDCalculation,
    saveEMICalculation,
    loadCalculationHistory,
    clearHistory,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
