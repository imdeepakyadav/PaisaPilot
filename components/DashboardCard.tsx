import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface DashboardCardProps {
  title: string
  value: string
  icon: React.ReactNode
  backgroundColor: string
  textColor: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, backgroundColor, textColor }) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: textColor, opacity: 0.7 }]}>{title}</Text>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
  },
})

export default DashboardCard
