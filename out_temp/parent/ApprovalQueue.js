"use strict";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function ApprovalQueue() {
  const { tasks, mockUsers, approveTask, rejectTask, acceptCounterOffer, rejectCounterOffer } = useTokaStore();
  const pendingItems = tasks.filter((t) => t.status === "pending" || t.status === "negotiating");
  const handleReject = (task) => {
    if (task.status === "negotiating") {
      Alert.prompt(
        "Decline Offer",
        "Why are you declining this counter-offer?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Decline Offer", onPress: (reason) => rejectCounterOffer(task.id, reason || "Offer declined.") }
        ]
      );
      return;
    }
    if (task.isWithdrawal) {
      Alert.alert(
        "Decline Withdrawal",
        "Would you like to return these tokens to the child's vault?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Decline", onPress: () => rejectTask(task.id, "Parent declined withdrawal.") }
        ]
      );
      return;
    }
    Alert.prompt(
      "Send Back Chore",
      "What needs to be fixed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Back", onPress: (reason) => rejectTask(task.id, reason || "Needs more work!") }
      ]
    );
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.section }, /* @__PURE__ */ React.createElement(View, { style: styles.rowBetween }, /* @__PURE__ */ React.createElement(Text, { style: styles.sectionTitle }, "Approvals Queue"), /* @__PURE__ */ React.createElement(View, { style: styles.countBadge }, /* @__PURE__ */ React.createElement(Text, { style: styles.countText }, pendingItems.length))), pendingItems.length === 0 ? /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20, gap: 5 } }, /* @__PURE__ */ React.createElement(Text, { style: [styles.emptyText, { marginVertical: 0 }] }, "Nothing to approve right now!"), /* @__PURE__ */ React.createElement(Ionicons, { name: "sparkles", size: 16, color: "#B2BEC3" })) : pendingItems.map((item) => {
    const isNegotiation = item.status === "negotiating";
    const childName = mockUsers.find((u) => u.id === (isNegotiation ? item.proposedBy : item.assignedTo[0]))?.name || "Child";
    return /* @__PURE__ */ React.createElement(View, { key: item.id, style: [
      styles.verifyCard,
      item.isWithdrawal ? styles.withdrawalCard : isNegotiation ? styles.negotiationCard : styles.choreCard
    ] }, /* @__PURE__ */ React.createElement(View, { style: styles.verifyInfo }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 } }, item.isWithdrawal ? /* @__PURE__ */ React.createElement(Ionicons, { name: "cash", size: 18, color: "#6C5CE7" }) : isNegotiation ? /* @__PURE__ */ React.createElement(Ionicons, { name: "hand-left", size: 18, color: "#E17055" }) : null, /* @__PURE__ */ React.createElement(Text, { style: [styles.verifyTaskName, { marginBottom: 0 }] }, item.isWithdrawal ? "Withdrawal Request" : isNegotiation ? "Counter Offer" : item.title)), isNegotiation ? /* @__PURE__ */ React.createElement(View, { style: { marginTop: 5 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.verifySubtitle }, "From: ", childName), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", marginVertical: 3, gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: { fontWeight: "bold", color: "#6C5CE7" } }, "Asks for: ", item.counterOfferAmount), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 12, color: "#6C5CE7" }), /* @__PURE__ */ React.createElement(Text, { style: { fontWeight: "bold", color: "#6C5CE7" } }, "(Original: ", item.reward, ")")), /* @__PURE__ */ React.createElement(Text, { style: { fontSize: 12, color: "#636E72", fontStyle: "italic" } }, '"', item.counterOfferReason, '"')) : /* @__PURE__ */ React.createElement(Text, { style: styles.verifySubtitle }, "From: ", childName)), item.proofUrl && !isNegotiation && /* @__PURE__ */ React.createElement(Image, { source: { uri: item.proofUrl }, style: styles.proofPreview }), /* @__PURE__ */ React.createElement(View, { style: styles.actionRow }, /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.rejectBtn, onPress: () => handleReject(item) }, /* @__PURE__ */ React.createElement(Text, { style: styles.rejectBtnText }, item.isWithdrawal ? "Decline" : isNegotiation ? "Decline Offer" : "Send Back")), /* @__PURE__ */ React.createElement(
      TouchableOpacity,
      {
        style: [styles.approveBtn, (item.isWithdrawal || isNegotiation) && { backgroundColor: "#6C5CE7" }],
        onPress: () => isNegotiation ? acceptCounterOffer(item.id) : approveTask(item.id)
      },
      /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.approveBtnText }, item.isWithdrawal ? `Release ${item.reward}` : isNegotiation ? "Accept Offer" : `Approve & Pay`), item.isWithdrawal ? /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 14, color: "white" }) : isNegotiation ? /* @__PURE__ */ React.createElement(Ionicons, { name: "sparkles", size: 14, color: "white" }) : /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 14, color: "white" }))
    )));
  }));
}
const styles = StyleSheet.create({
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436", marginBottom: 15 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  countBadge: { backgroundColor: "#D63031", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { color: "white", fontWeight: "bold", fontSize: 12 },
  emptyText: { textAlign: "center", color: "#B2BEC3", fontStyle: "italic", marginVertical: 20 },
  verifyCard: { backgroundColor: "#F8F9FA", borderRadius: 15, padding: 15, marginBottom: 10, borderLeftWidth: 5 },
  choreCard: { borderLeftColor: "#F39C12" },
  withdrawalCard: { borderLeftColor: "#6C5CE7" },
  negotiationCard: { borderLeftColor: "#E17055" },
  verifyTaskName: { fontSize: 16, fontWeight: "700", color: "#2D3436" },
  verifySubtitle: { fontSize: 12, color: "#636E72", marginBottom: 10 },
  verifyInfo: { marginBottom: 10 },
  proofPreview: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  rejectBtn: { flex: 0.35, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D63031", padding: 12, borderRadius: 10, alignItems: "center" },
  rejectBtnText: { color: "#D63031", fontWeight: "bold", fontSize: 12 },
  approveBtn: { flex: 0.6, backgroundColor: "#00B894", padding: 12, borderRadius: 10, alignItems: "center" },
  approveBtnText: { color: "white", fontWeight: "bold" }
});
