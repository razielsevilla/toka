"use strict";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
function getRemainingTime(deadline) {
  if (!deadline) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1e3 * 60 * 60));
  const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
  return `${hours}h ${minutes}m`;
}
export default function ChoreBoard() {
  const { currentUser, tasks, acceptTask, submitTask, clearNotifications, notifications, submitCounterOffer } = useTokaStore();
  const [activeTab, setActiveTab] = useState("daily");
  const [negotiatingTaskId, setNegotiatingTaskId] = useState(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterReason, setCounterReason] = useState("");
  const choreNotifs = notifications.filter((n) => (n.type === "task" || n.type === "rejection") && !n.read).length;
  const now = Date.now();
  const myTasks = tasks.filter((t) => t.assignedTo.includes(currentUser?.id || "") && t.status !== "completed" && (!t.deadline || t.deadline > now));
  const availablePool = tasks.filter((t) => t.type === "spontaneous" && t.status === "open" && t.assignedTo.length === 0 && (!t.deadline || t.deadline > now));
  const filteredTasks = myTasks.filter((t) => activeTab === "daily" ? t.frequency === "daily" || t.type === "spontaneous" : t.frequency === activeTab).sort((a) => a.rejectionReason ? -1 : 1);
  const handleVerify = async (taskId) => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) {
      submitTask(taskId, result.assets[0].uri);
      clearNotifications("rejection");
      Alert.alert("Sent for Review!", "Mom or Dad will check it soon.");
    }
  };
  const handleSendOffer = (taskId) => {
    if (!counterAmount || !counterReason) {
      Alert.alert("Missing Info", "Please provide how many tokens you want, and why!");
      return;
    }
    const amountNum = parseInt(counterAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Tokens must be a positive number.");
      return;
    }
    submitCounterOffer(taskId, currentUser?.id || "", amountNum, counterReason);
    setNegotiatingTaskId(null);
    setCounterAmount("");
    setCounterReason("");
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.section }, /* @__PURE__ */ React.createElement(View, { style: styles.row }, /* @__PURE__ */ React.createElement(Text, { style: styles.sectionTitle }, "Chore Board"), choreNotifs > 0 && /* @__PURE__ */ React.createElement(View, { style: styles.badge }, /* @__PURE__ */ React.createElement(Text, { style: styles.badgeText }, choreNotifs))), /* @__PURE__ */ React.createElement(View, { style: styles.tabContainer }, ["daily", "weekly", "monthly"].map((tab) => /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      key: tab,
      onPress: () => {
        setActiveTab(tab);
        clearNotifications("task");
      },
      style: [styles.tabButton, activeTab === tab && styles.activeTabButton]
    },
    /* @__PURE__ */ React.createElement(Text, { style: [styles.tabText, activeTab === tab && styles.activeTabText] }, tab.toUpperCase())
  ))), filteredTasks.map((task) => /* @__PURE__ */ React.createElement(View, { key: task.id, style: [styles.taskCard, task.rejectionReason && styles.rejectedCard] }, /* @__PURE__ */ React.createElement(View, { style: styles.rowBetween }, /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: styles.taskTitle }, task.title), /* @__PURE__ */ React.createElement(View, { style: styles.tagsRow }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 2 } }, task.type === "spontaneous" && /* @__PURE__ */ React.createElement(Ionicons, { name: "flash", size: 10, color: "#B2BEC3" }), /* @__PURE__ */ React.createElement(Text, { style: styles.typeTag }, task.type === "spontaneous" ? "INSTANT" : task.frequency?.toUpperCase())), task.deadline && /* @__PURE__ */ React.createElement(View, { style: [styles.deadlineTag, { flexDirection: "row", alignItems: "center", gap: 2 }] }, /* @__PURE__ */ React.createElement(Ionicons, { name: "hourglass", size: 10, color: "#E17055" }), /* @__PURE__ */ React.createElement(Text, { style: { fontSize: 9, fontWeight: "800", color: "#E17055" } }, getRemainingTime(task.deadline), " left")))), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 14, color: "#0984E3" }), /* @__PURE__ */ React.createElement(Text, { style: styles.taskReward }, task.reward))), task.rejectionReason && /* @__PURE__ */ React.createElement(View, { style: styles.rejectionBox }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "chatbubble-ellipses", size: 12, color: "#D63031" }), /* @__PURE__ */ React.createElement(Text, { style: styles.rejectionText }, 'Fix: "', task.rejectionReason, '"'))), /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      style: [styles.verifyBtn, task.status === "pending" && styles.disabledBtn],
      onPress: () => handleVerify(task.id),
      disabled: task.status === "pending"
    },
    /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.btnText }, task.status === "pending" ? "Reviewing..." : "Verify"), task.status !== "pending" && /* @__PURE__ */ React.createElement(Ionicons, { name: "camera", size: 14, color: "white" }))
  ))), activeTab === "daily" && availablePool.map((task) => /* @__PURE__ */ React.createElement(View, { key: task.id, style: styles.poolCard }, negotiatingTaskId === task.id ? /* @__PURE__ */ React.createElement(View, { style: styles.negotiateForm }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.formLabel }, "Negotiating: ", task.title, " (Current: ", task.reward), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 12, color: "#2D3436" }), /* @__PURE__ */ React.createElement(Text, { style: styles.formLabel }, ")")), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", gap: 10, marginVertical: 10 } }, /* @__PURE__ */ React.createElement(TextInput, { style: [styles.input, { flex: 0.3 }], placeholder: "Amount", keyboardType: "numeric", value: counterAmount, onChangeText: setCounterAmount }), /* @__PURE__ */ React.createElement(TextInput, { style: [styles.input, { flex: 0.7 }], placeholder: "Reason? (e.g. Too hard)", value: counterReason, onChangeText: setCounterReason })), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", justifyContent: "flex-end", gap: 10 } }, /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.cancelBtn, onPress: () => setNegotiatingTaskId(null) }, /* @__PURE__ */ React.createElement(Text, { style: styles.cancelBtnText }, "Cancel")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.submitOfferBtn, onPress: () => handleSendOffer(task.id) }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.btnText }, "Send Offer"), /* @__PURE__ */ React.createElement(Ionicons, { name: "sparkles", size: 12, color: "white" }))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: styles.taskTitle }, task.title), /* @__PURE__ */ React.createElement(View, { style: styles.tagsRow }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 14, color: "#0984E3" }), /* @__PURE__ */ React.createElement(Text, { style: styles.taskReward }, task.reward)), task.deadline && /* @__PURE__ */ React.createElement(View, { style: [styles.deadlineTag, { flexDirection: "row", alignItems: "center", gap: 2 }] }, /* @__PURE__ */ React.createElement(Ionicons, { name: "hourglass", size: 10, color: "#E17055" }), /* @__PURE__ */ React.createElement(Text, { style: { fontSize: 9, fontWeight: "800", color: "#E17055" } }, getRemainingTime(task.deadline), " left")))), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", gap: 8 } }, /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.negotiateBtn, onPress: () => setNegotiatingTaskId(task.id) }, /* @__PURE__ */ React.createElement(Text, { style: styles.negotiateBtnText }, "Negotiate")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.claimBtn, onPress: () => acceptTask(task.id, currentUser?.id || "") }, /* @__PURE__ */ React.createElement(Text, { style: styles.btnText }, "Claim")))))));
}
const styles = StyleSheet.create({
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tabContainer: { flexDirection: "row", backgroundColor: "#F1F2F6", borderRadius: 12, padding: 4, marginBottom: 15, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  activeTabButton: { backgroundColor: "#FFF", elevation: 2 },
  tabText: { fontSize: 10, fontWeight: "800", color: "#B2BEC3" },
  activeTabText: { color: "#6C5CE7" },
  taskCard: { backgroundColor: "#F8F9FA", padding: 15, borderRadius: 20, marginBottom: 12 },
  taskTitle: { fontSize: 15, fontWeight: "700", color: "#2D3436" },
  taskReward: { color: "#0984E3", fontWeight: "bold", fontSize: 16 },
  tagsRow: { flexDirection: "row", alignItems: "center", marginTop: 2, gap: 5 },
  typeTag: { fontSize: 9, fontWeight: "800", color: "#B2BEC3" },
  deadlineTag: { fontSize: 9, fontWeight: "800", color: "#E17055", backgroundColor: "#FFEAA7", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  verifyBtn: { backgroundColor: "#6C5CE7", padding: 12, borderRadius: 12, marginTop: 12, alignItems: "center" },
  disabledBtn: { backgroundColor: "#B2BEC3" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 12 },
  rejectionBox: { backgroundColor: "#FFEAEA", padding: 10, borderRadius: 10, marginTop: 10 },
  rejectionText: { color: "#D63031", fontSize: 11, fontWeight: "bold" },
  rejectedCard: { borderLeftWidth: 6, borderLeftColor: "#D63031" },
  poolCard: { backgroundColor: "#E1F5FE", padding: 15, borderRadius: 20, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderStyle: "dashed", borderWidth: 1, borderColor: "#03A9F4" },
  claimBtn: { backgroundColor: "#03A9F4", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  badge: { backgroundColor: "#D63031", minWidth: 18, height: 18, borderRadius: 9, justifyContent: "center", alignItems: "center", marginLeft: 8 },
  badgeText: { color: "white", fontSize: 10, fontWeight: "900" },
  negotiateBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#03A9F4", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  negotiateBtnText: { color: "#03A9F4", fontWeight: "bold", fontSize: 12 },
  negotiateForm: { width: "100%" },
  formLabel: { fontSize: 13, fontWeight: "700", color: "#2D3436" },
  input: { backgroundColor: "#FFF", borderRadius: 8, padding: 10, fontSize: 13, color: "#2D3436", borderWidth: 1, borderColor: "#B2BEC3" },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 15 },
  cancelBtnText: { color: "#B2BEC3", fontWeight: "700", fontSize: 12 },
  submitOfferBtn: { backgroundColor: "#6C5CE7", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }
});
