"use strict";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function TokaBank() {
  const { currentUser, transactions, depositToVault, withdrawFromVault, vaultBalance, tasks } = useTokaStore();
  const [showHistory, setShowHistory] = useState(false);
  const [bankAmount, setBankAmount] = useState("");
  const userTokens = currentUser?.tokens || 0;
  const isPending = tasks.some((t) => t.isWithdrawal && t.status === "pending");
  return /* @__PURE__ */ React.createElement(View, { style: styles.bankCard }, /* @__PURE__ */ React.createElement(View, { style: styles.bankHeader }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "business", size: 20, color: "#FFF" }), /* @__PURE__ */ React.createElement(Text, { style: styles.bankTitle }, "Toka Bank")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.historyBtnSmall, onPress: () => setShowHistory(true) }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.historyBtnText }, "History"), /* @__PURE__ */ React.createElement(Ionicons, { name: "receipt", size: 12, color: "#FFF" })))), /* @__PURE__ */ React.createElement(View, { style: styles.bankMainRow }, /* @__PURE__ */ React.createElement(View, { style: styles.accountBox }, /* @__PURE__ */ React.createElement(Text, { style: styles.accountLabel }, "SPENDABLE"), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "wallet", size: 24, color: "#FFF" }), /* @__PURE__ */ React.createElement(Text, { style: styles.accountAmount }, userTokens))), /* @__PURE__ */ React.createElement(View, { style: styles.bankDivider }), /* @__PURE__ */ React.createElement(View, { style: styles.accountBox }, /* @__PURE__ */ React.createElement(Text, { style: styles.accountLabel }, "VAULT SAVINGS"), /* @__PURE__ */ React.createElement(View, { style: styles.vaultRow }, /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 24, color: "#FDCB6E" }), /* @__PURE__ */ React.createElement(Text, { style: styles.vaultAmountMain }, vaultBalance), /* @__PURE__ */ React.createElement(View, { style: styles.interestTag }, /* @__PURE__ */ React.createElement(Text, { style: styles.interestText }, "+5%"))), isPending && /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "hourglass", size: 10, color: "#F39C12" }), /* @__PURE__ */ React.createElement(Text, { style: styles.pendingText }, "Withdrawal Pending...")))), /* @__PURE__ */ React.createElement(View, { style: styles.inputWrapper }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: styles.bankInput,
      placeholder: "Amount",
      placeholderTextColor: "rgba(255,255,255,0.4)",
      keyboardType: "numeric",
      value: bankAmount,
      onChangeText: setBankAmount
    }
  )), /* @__PURE__ */ React.createElement(View, { style: styles.bankActionRow }, /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      style: [styles.bankActionBtn, { borderRightWidth: 1, borderColor: "rgba(255,255,255,0.1)" }],
      onPress: () => {
        depositToVault(Number(bankAmount));
        setBankAmount("");
      }
    },
    /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.bankActionText }, "Save"), /* @__PURE__ */ React.createElement(Ionicons, { name: "download", size: 14, color: "#FFF" }))
  ), /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      style: styles.bankActionBtn,
      onPress: () => {
        withdrawFromVault(Number(bankAmount));
        setBankAmount("");
      }
    },
    /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.bankActionText }, "Take Out"), /* @__PURE__ */ React.createElement(Ionicons, { name: "log-out", size: 14, color: "#FFF" }))
  )), /* @__PURE__ */ React.createElement(Modal, { visible: showHistory, animationType: "slide" }, /* @__PURE__ */ React.createElement(View, { style: styles.modalContainer }, /* @__PURE__ */ React.createElement(Text, { style: styles.modalTitle }, "Activity Ledger"), /* @__PURE__ */ React.createElement(ScrollView, null, transactions.map((tx) => /* @__PURE__ */ React.createElement(View, { key: tx.id, style: styles.txRow }, /* @__PURE__ */ React.createElement(Text, { style: tx.type === "earn" ? styles.txEarn : styles.txSpend }, tx.type === "earn" ? "+" : "-", tx.amount), /* @__PURE__ */ React.createElement(Text, { style: styles.txReason }, tx.reason)))), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.closeBtn, onPress: () => setShowHistory(false) }, /* @__PURE__ */ React.createElement(Text, { style: styles.btnText }, "Return to App")))));
}
const styles = StyleSheet.create({
  bankCard: { backgroundColor: "#6C5CE7", margin: 15, borderRadius: 25, paddingVertical: 20, elevation: 8 },
  bankHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center", marginBottom: 20 },
  bankTitle: { color: "#FFF", fontSize: 18, fontWeight: "900" },
  historyBtnSmall: { backgroundColor: "rgba(255,255,255,0.15)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  historyBtnText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  bankMainRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 20 },
  accountBox: { alignItems: "center", flex: 1 },
  accountLabel: { color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: "900", marginBottom: 5 },
  accountAmount: { color: "#FFF", fontSize: 24, fontWeight: "900" },
  vaultAmountMain: { color: "#FDCB6E", fontSize: 24, fontWeight: "900" },
  bankDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.1)" },
  inputWrapper: { paddingHorizontal: 40, marginBottom: 15 },
  bankInput: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, color: "#FFF", textAlign: "center", fontSize: 18, fontWeight: "bold", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  bankActionRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", marginTop: 10 },
  bankActionBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  bankActionText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  pendingText: { color: "#F39C12", fontSize: 8, fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 30, backgroundColor: "#FFF" },
  modalTitle: { fontSize: 24, fontWeight: "900", marginBottom: 20 },
  txRow: { flexDirection: "row", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  txEarn: { color: "#00B894", fontWeight: "bold", width: 40 },
  txSpend: { color: "#D63031", fontWeight: "bold", width: 40 },
  txReason: { flex: 1, color: "#2D3436", fontSize: 13 },
  closeBtn: { backgroundColor: "#2D3436", padding: 15, borderRadius: 15, marginTop: 20, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 12 },
  vaultRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  interestTag: { backgroundColor: "#00B894", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 4 },
  interestText: { color: "#FFF", fontSize: 10, fontWeight: "900" }
});
