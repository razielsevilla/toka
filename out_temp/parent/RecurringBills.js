"use strict";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function RecurringBills() {
  const { bills, addBill, removeBill, processBills } = useTokaStore();
  const [billTitle, setBillTitle] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billFrequency, setBillFrequency] = useState("weekly");
  const handleAddBill = () => {
    if (!billTitle || !billAmount) {
      Alert.alert("Missing Info", "Please provide a name and amount for this bill.");
      return;
    }
    const amount = parseInt(billAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid token amount over 0.");
      return;
    }
    addBill({
      title: billTitle,
      amount,
      frequency: billFrequency
    });
    setBillTitle("");
    setBillAmount("");
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.section }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 15 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "receipt", size: 20, color: "#2D3436" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.sectionTitle, { marginBottom: 0 }] }, "Taxes & Bills")), /* @__PURE__ */ React.createElement(View, { style: styles.billsList }, bills.length === 0 ? /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10, gap: 5 } }, /* @__PURE__ */ React.createElement(Text, { style: [styles.emptyText, { marginVertical: 0 }] }, "No active bills. Kids are living rent-free!"), /* @__PURE__ */ React.createElement(Ionicons, { name: "partly-sunny", size: 16, color: "#B2BEC3" })) : bills.map((bill) => /* @__PURE__ */ React.createElement(View, { key: bill.id, style: styles.billCard }, /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: styles.billTitle }, bill.title), /* @__PURE__ */ React.createElement(Text, { style: styles.billDetails }, bill.amount, " tokens / ", bill.frequency)), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.deleteBtn, onPress: () => removeBill(bill.id) }, /* @__PURE__ */ React.createElement(Text, { style: styles.deleteText }, "\u2715"))))), /* @__PURE__ */ React.createElement(Text, { style: styles.subTitle }, "Create New Deduction"), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: styles.input,
      placeholder: "e.g., WiFi Tax, Device Rent",
      placeholderTextColor: "#999",
      value: billTitle,
      onChangeText: setBillTitle
    }
  ), /* @__PURE__ */ React.createElement(View, { style: styles.rowBetween }, /* @__PURE__ */ React.createElement(View, { style: { flex: 0.45 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.miniLabel }, "Amount"), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: styles.input,
      placeholder: "Tokens",
      keyboardType: "numeric",
      value: billAmount,
      onChangeText: setBillAmount
    }
  )), /* @__PURE__ */ React.createElement(View, { style: { flex: 0.45 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.miniLabel }, "Frequency"), /* @__PURE__ */ React.createElement(View, { style: styles.frequencyRow }, ["daily", "weekly", "monthly"].map((f) => /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      key: f,
      onPress: () => setBillFrequency(f),
      style: [styles.freqBtn, billFrequency === f && styles.freqBtnActive]
    },
    /* @__PURE__ */ React.createElement(Text, { style: [styles.freqBtnText, billFrequency === f && styles.freqBtnTextActive] }, f.charAt(0).toUpperCase() + f.slice(1, 3))
  ))))), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.submitBtn, onPress: handleAddBill }, /* @__PURE__ */ React.createElement(Text, { style: styles.submitBtnText }, "Add Deduction")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.simulateBtn, onPress: processBills }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.simulateText }, "Prototype: Trigger Bills Now"), /* @__PURE__ */ React.createElement(Ionicons, { name: "flash", size: 14, color: "#E17055" }))));
}
const styles = StyleSheet.create({
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436", marginBottom: 15 },
  subTitle: { fontSize: 14, fontWeight: "700", color: "#2D3436", marginTop: 15, marginBottom: 10 },
  billsList: { marginBottom: 10 },
  emptyText: { fontSize: 12, color: "#B2BEC3", fontStyle: "italic", textAlign: "center", marginVertical: 10 },
  billCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#E17055"
  },
  billTitle: { fontSize: 14, fontWeight: "700", color: "#2D3436" },
  billDetails: { fontSize: 12, color: "#B2BEC3", marginTop: 2 },
  deleteBtn: { padding: 5 },
  deleteText: { fontSize: 16, color: "#FF7675", fontWeight: "bold" },
  input: { backgroundColor: "#F1F2F6", borderRadius: 10, padding: 12, fontSize: 14, color: "#2D3436", marginBottom: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  miniLabel: { fontSize: 10, fontWeight: "bold", color: "#B2BEC3", marginBottom: 5 },
  frequencyRow: { flexDirection: "row", gap: 5 },
  freqBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8, backgroundColor: "#F1F2F6" },
  freqBtnActive: { backgroundColor: "#E17055" },
  freqBtnText: { fontSize: 11, fontWeight: "600", color: "#B2BEC3" },
  freqBtnTextActive: { color: "#FFF" },
  submitBtn: { backgroundColor: "#E17055", padding: 15, borderRadius: 15, alignItems: "center", marginTop: 10 },
  submitBtnText: { color: "white", fontWeight: "800", fontSize: 14 },
  simulateBtn: { marginTop: 15, paddingVertical: 10, borderWidth: 1, borderColor: "#EEE", borderRadius: 10, alignItems: "center" },
  simulateText: { fontSize: 11, color: "#E17055", fontWeight: "700" }
});
