"use strict";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function PeerTransfer() {
  const { currentUser, user, mockUsers, transferTokens } = useTokaStore();
  const activeUser = currentUser || user;
  const [selectedSibling, setSelectedSibling] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [memo, setMemo] = useState("");
  const siblings = mockUsers.filter((u) => u.role === "member" && u.id !== activeUser.id);
  const handleTransfer = () => {
    if (!selectedSibling) {
      Alert.alert("Missing Sibling", "Please select someone to send tokens to!");
      return;
    }
    const amountNum = parseInt(transferAmount, 10);
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount of tokens.");
      return;
    }
    if (amountNum > activeUser.tokens) {
      Alert.alert("Not Enough Tokens", "You don't have enough spendable tokens for this transfer.");
      return;
    }
    transferTokens(selectedSibling, amountNum, memo || "Just because!");
    setSelectedSibling(null);
    setTransferAmount("");
    setMemo("");
  };
  if (siblings.length === 0) return null;
  return /* @__PURE__ */ React.createElement(View, { style: styles.section }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "cash", size: 20, color: "#2D3436" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.sectionTitle, { marginBottom: 0 }] }, "Pay a Sibling")), /* @__PURE__ */ React.createElement(Text, { style: styles.sectionSubtitle }, "Send tokens from your Wallet Balance."), /* @__PURE__ */ React.createElement(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: styles.siblingScroller }, siblings.map((sib) => /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      key: sib.id,
      style: [styles.siblingCard, selectedSibling === sib.id && styles.siblingCardActive],
      onPress: () => setSelectedSibling(sib.id)
    },
    /* @__PURE__ */ React.createElement(View, { style: styles.siblingAvatar }, /* @__PURE__ */ React.createElement(Text, { style: styles.siblingAvatarText }, sib.name.charAt(0).toUpperCase())),
    /* @__PURE__ */ React.createElement(Text, { style: [styles.siblingName, selectedSibling === sib.id && styles.siblingNameActive] }, sib.name.split(" ")[0])
  ))), selectedSibling && /* @__PURE__ */ React.createElement(View, { style: styles.transferForm }, /* @__PURE__ */ React.createElement(View, { style: styles.inputRow }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: [styles.input, { flex: 0.3 }],
      placeholder: "Amt (Tokens)",
      keyboardType: "numeric",
      value: transferAmount,
      onChangeText: setTransferAmount
    }
  ), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: [styles.input, { flex: 0.7 }],
      placeholder: "What's this for?",
      value: memo,
      onChangeText: setMemo
    }
  )), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.sendBtn, onPress: handleTransfer }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.sendBtnText }, "Send Tokens"), /* @__PURE__ */ React.createElement(Ionicons, { name: "paper-plane", size: 16, color: "white" })))));
}
const styles = StyleSheet.create({
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436" },
  sectionSubtitle: { fontSize: 12, color: "#636E72", marginBottom: 15 },
  siblingScroller: { marginBottom: 10 },
  siblingCard: { alignItems: "center", marginRight: 15, padding: 10, borderRadius: 15, borderWidth: 2, borderColor: "transparent" },
  siblingCardActive: { borderColor: "#A29BFE", backgroundColor: "#F4F1FF" },
  siblingAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#DFE6E9", justifyContent: "center", alignItems: "center", marginBottom: 5 },
  siblingAvatarText: { fontSize: 20, fontWeight: "800", color: "#2D3436" },
  siblingName: { fontSize: 12, fontWeight: "700", color: "#636E72" },
  siblingNameActive: { color: "#6C5CE7" },
  transferForm: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#F1F2F6", paddingTop: 15 },
  inputRow: { flexDirection: "row", gap: 10, marginBottom: 15 },
  input: { backgroundColor: "#F8F9FA", borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: "#EEE", color: "#2D3436" },
  sendBtn: { backgroundColor: "#6C5CE7", paddingVertical: 14, borderRadius: 15, alignItems: "center" },
  sendBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 }
});
