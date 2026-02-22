"use strict";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function WishlistHero() {
  const { currentUser, marketItems, fundGoal, purchaseItem } = useTokaStore();
  const [depositAmount, setDepositAmount] = useState("");
  const activeGoal = currentUser?.activeGoal;
  const userTokens = currentUser?.tokens || 0;
  if (!activeGoal) {
    return /* @__PURE__ */ React.createElement(View, { style: styles.goalHeroCard }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 5 } }, /* @__PURE__ */ React.createElement(Text, { style: [styles.emptyGoalText, { marginBottom: 0 }] }, "No Savings Goal Set!"), /* @__PURE__ */ React.createElement(Ionicons, { name: "flag", size: 18, color: "#2D3436" })), /* @__PURE__ */ React.createElement(Text, { style: styles.emptyGoalSub }, "Head down to the marketplace and select an item to start working towards."));
  }
  const goalItem = marketItems.find((i) => i.id === activeGoal.itemId);
  if (!goalItem) return null;
  const cost = goalItem.cost;
  const saved = activeGoal.savedTokens;
  const progress = Math.min(saved / cost, 1);
  const remaining = Math.max(cost - saved, 0);
  const handleDeposit = () => {
    const amount = parseInt(depositAmount, 10);
    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid amount of tokens.");
      return;
    }
    if (amount > userTokens) {
      Alert.alert("Not Enough Tokens", `You only have ${userTokens} tokens right now!`);
      return;
    }
    fundGoal(amount);
    setDepositAmount("");
  };
  const handlePurchase = () => {
    purchaseItem(goalItem.id);
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.goalHeroCard }, /* @__PURE__ */ React.createElement(View, { style: styles.rowBetween }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "star", size: 12, color: "#B2BEC3" }), /* @__PURE__ */ React.createElement(Text, { style: styles.goalTitle }, "My Current Goal")), progress >= 1 && /* @__PURE__ */ React.createElement(View, { style: { backgroundColor: "#00B894", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: { fontSize: 10, fontWeight: "bold", color: "#FFF" } }, "Ready to Buy!"), /* @__PURE__ */ React.createElement(Ionicons, { name: "partly-sunny", size: 12, color: "#FFF" }))), /* @__PURE__ */ React.createElement(Text, { style: styles.goalItemName }, goalItem.name), /* @__PURE__ */ React.createElement(View, { style: styles.goalStatsRow }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.goalStatText }, "Saved: ", saved), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 10, color: "#2D3436" })), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.goalStatText }, "Goal: ", cost), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 10, color: "#2D3436" }))), /* @__PURE__ */ React.createElement(View, { style: styles.goalBarBg }, /* @__PURE__ */ React.createElement(View, { style: [styles.goalBarFill, { width: `${progress * 100}%` }] })), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 10 } }, /* @__PURE__ */ React.createElement(Text, { style: [styles.walletBalanceText, { marginTop: 0 }] }, "Wallet Balance: ", userTokens), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 10, color: "#B2BEC3" })), progress < 1 ? /* @__PURE__ */ React.createElement(View, { style: styles.depositRow }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: styles.depositInput,
      placeholder: "Fund Goal",
      keyboardType: "numeric",
      value: depositAmount,
      onChangeText: setDepositAmount
    }
  ), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.depositBtn, onPress: handleDeposit }, /* @__PURE__ */ React.createElement(Text, { style: styles.depositBtnText }, "Deposit"))) : /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.purchaseBtn, onPress: handlePurchase }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.purchaseBtnText }, "Buy Now!"), /* @__PURE__ */ React.createElement(Ionicons, { name: "gift", size: 16, color: "white" }))));
}
const styles = StyleSheet.create({
  goalHeroCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2, borderColor: "#FDCB6E" },
  emptyGoalText: { fontSize: 18, fontWeight: "800", color: "#2D3436", textAlign: "center", marginBottom: 5 },
  emptyGoalSub: { fontSize: 12, color: "#636E72", textAlign: "center" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  goalTitle: { fontSize: 12, fontWeight: "800", color: "#B2BEC3", textTransform: "uppercase" },
  goalReadyText: { fontSize: 10, fontWeight: "bold", color: "#FFF", backgroundColor: "#00B894", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  goalItemName: { fontSize: 22, fontWeight: "900", color: "#6C5CE7", marginVertical: 8 },
  goalStatsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  goalStatText: { fontSize: 12, fontWeight: "bold", color: "#2D3436" },
  goalBarBg: { height: 14, backgroundColor: "#F1F2F6", borderRadius: 7, overflow: "hidden" },
  goalBarFill: { height: "100%", backgroundColor: "#00B894", borderRadius: 7 },
  walletBalanceText: { fontSize: 11, fontStyle: "italic", color: "#B2BEC3", marginTop: 10, textAlign: "right" },
  depositRow: { flexDirection: "row", marginTop: 15, gap: 10 },
  depositInput: { flex: 0.6, backgroundColor: "#F8F9FA", borderRadius: 10, padding: 10, fontSize: 14, borderWidth: 1, borderColor: "#F1F2F6" },
  depositBtn: { flex: 0.4, backgroundColor: "#FDCB6E", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  depositBtnText: { color: "#2D3436", fontWeight: "bold", fontSize: 14 },
  purchaseBtn: { width: "100%", backgroundColor: "#00B894", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 15 },
  purchaseBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 }
});
