"use strict";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function MarketAlerts() {
  const { notifications, clearNotifications } = useTokaStore();
  const marketAlerts = notifications.filter((n) => n.type === "market_purchase" && !n.read);
  if (marketAlerts.length === 0) return null;
  return /* @__PURE__ */ React.createElement(View, { style: styles.alertBanner }, /* @__PURE__ */ React.createElement(View, { style: styles.rowBetween }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "notifications", size: 16, color: "#856404" }), /* @__PURE__ */ React.createElement(Text, { style: styles.alertTitle }, "Market Claims")), /* @__PURE__ */ React.createElement(TouchableOpacity, { onPress: () => clearNotifications("market_purchase") }, /* @__PURE__ */ React.createElement(Text, { style: styles.dismissText }, "Clear All"))), marketAlerts.map((alert) => /* @__PURE__ */ React.createElement(View, { key: alert.id, style: styles.alertRow }, /* @__PURE__ */ React.createElement(Text, { style: styles.alertText }, "\u2022 ", alert.message))));
}
const styles = StyleSheet.create({
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  alertBanner: { backgroundColor: "#FFF3CD", margin: 15, padding: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: "#FFC107" },
  alertTitle: { fontWeight: "bold", color: "#856404", fontSize: 14 },
  dismissText: { color: "#0984E3", fontWeight: "bold", fontSize: 11 },
  alertRow: { marginTop: 5 },
  alertText: { fontSize: 13, color: "#856404" }
});
