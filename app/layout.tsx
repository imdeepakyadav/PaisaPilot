import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaisaPilot – Personal Finance & AI Expense Manager",
  description:
    "PaisaPilot is an open-source personal finance app built with React Native & Expo, featuring expense tracking, financial calculators, and AI-powered savings and investment suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
