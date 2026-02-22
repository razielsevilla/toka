"use strict";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function ChildTracker() {
  const { tasks, mockUsers, vaultBalance, generateInviteCode, addMember } = useTokaStore();
  const householdMembers = mockUsers.filter((u) => u.role === "member");
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [modalMode, setModalMode] = useState("link");
  const [newChildName, setNewChildName] = useState("");
  const openInviteModal = () => {
    setInviteCode(generateInviteCode());
    setModalMode("link");
    setNewChildName("");
    setIsInviteModalVisible(true);
  };
  const handleManualAdd = () => {
    if (!newChildName.trim()) {
      Alert.alert("Oops!", "Please enter a name for the child.");
      return;
    }
    addMember(newChildName.trim(), "member");
    setIsInviteModalVisible(false);
    setNewChildName("");
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.trackerSection }, /* @__PURE__ */ React.createElement(Text, { style: styles.sectionTitle }, "Child Activity Tracker"), /* @__PURE__ */ React.createElement(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: styles.trackerScroll }, householdMembers.map((child) => {
    const childTasks = tasks.filter((t) => t.assignedTo.includes(child.id));
    const completedCount = childTasks.filter((t) => t.status === "completed").length;
    return /* @__PURE__ */ React.createElement(View, { key: child.id, style: styles.childDetailCard }, /* @__PURE__ */ React.createElement(View, { style: styles.childHeader }, /* @__PURE__ */ React.createElement(Text, { style: styles.detailName }, child.name.split(" ")[0]), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 14, color: "#00B894" }), /* @__PURE__ */ React.createElement(Text, { style: styles.detailTokens }, child.tokens))), /* @__PURE__ */ React.createElement(View, { style: styles.statsMiniRow }, /* @__PURE__ */ React.createElement(View, { style: styles.statBox }, /* @__PURE__ */ React.createElement(Text, { style: styles.statLabel }, "VAULT"), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 12, color: "#6C5CE7" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.statVal, { color: "#6C5CE7" }] }, vaultBalance))), /* @__PURE__ */ React.createElement(View, { style: styles.statBox }, /* @__PURE__ */ React.createElement(Text, { style: styles.statLabel }, "STREAK"), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "flame", size: 12, color: "#E17055" }), /* @__PURE__ */ React.createElement(Text, { style: styles.statVal }, child.streak)))), /* @__PURE__ */ React.createElement(Text, { style: styles.miniLabel }, "Chore Progress (", completedCount, "/", childTasks.length, ")"), /* @__PURE__ */ React.createElement(View, { style: styles.progressBarBg }, /* @__PURE__ */ React.createElement(View, { style: [styles.progressBarFill, { width: `${completedCount / Math.max(childTasks.length, 1) * 100}%` }] })));
  }), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.addMemberCard, onPress: openInviteModal }, /* @__PURE__ */ React.createElement(View, { style: styles.addMemberIconPlaceholder }, /* @__PURE__ */ React.createElement(Text, { style: styles.addMemberPlusText }, "+")), /* @__PURE__ */ React.createElement(Text, { style: styles.addMemberCardText }, "Add Member"))), /* @__PURE__ */ React.createElement(Modal, { visible: isInviteModalVisible, transparent: true, animationType: "slide" }, /* @__PURE__ */ React.createElement(View, { style: styles.modalOverlay }, /* @__PURE__ */ React.createElement(View, { style: styles.modalContent }, /* @__PURE__ */ React.createElement(View, { style: styles.modalHeader }, /* @__PURE__ */ React.createElement(Text, { style: styles.modalTitle }, "Add a Member"), /* @__PURE__ */ React.createElement(TouchableOpacity, { onPress: () => setIsInviteModalVisible(false) }, /* @__PURE__ */ React.createElement(View, { style: styles.closeBtnIcon }, /* @__PURE__ */ React.createElement(Ionicons, { name: "close", size: 18, color: "#2D3436" })))), /* @__PURE__ */ React.createElement(View, { style: styles.tabContainer }, /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      style: [styles.tabBtn, modalMode === "link" && styles.tabBtnActive],
      onPress: () => setModalMode("link")
    },
    /* @__PURE__ */ React.createElement(Text, { style: [styles.tabText, modalMode === "link" && styles.tabTextActive] }, "Link Device")
  ), /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      style: [styles.tabBtn, modalMode === "manual" && styles.tabBtnActive],
      onPress: () => setModalMode("manual")
    },
    /* @__PURE__ */ React.createElement(Text, { style: [styles.tabText, modalMode === "manual" && styles.tabTextActive] }, "Add Manually")
  )), modalMode === "link" ? /* @__PURE__ */ React.createElement(View, { style: styles.tabBody }, /* @__PURE__ */ React.createElement(Text, { style: styles.modalSub }, "Give this code to your child. They can enter it when they open Toka on their phone to join your household."), /* @__PURE__ */ React.createElement(View, { style: styles.codeBox }, /* @__PURE__ */ React.createElement(Text, { selectable: true, style: styles.codeTextLarge }, inviteCode)), /* @__PURE__ */ React.createElement(
    TouchableOpacity,
    {
      style: styles.actionBtnPrimary,
      onPress: () => {
        Alert.alert("Copied!", "Code copied to clipboard.");
        setIsInviteModalVisible(false);
      }
    },
    /* @__PURE__ */ React.createElement(Text, { style: styles.actionBtnText }, "Copy & Share Link")
  )) : /* @__PURE__ */ React.createElement(View, { style: styles.tabBody }, /* @__PURE__ */ React.createElement(Text, { style: styles.modalSub }, "Create a profile for a child directly on this device for testing or sharing a household tablet."), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: styles.modalInput,
      placeholder: "Child's First Name",
      placeholderTextColor: "#A0AEC0",
      value: newChildName,
      onChangeText: setNewChildName,
      maxLength: 15
    }
  ), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.actionBtnPrimary, onPress: handleManualAdd }, /* @__PURE__ */ React.createElement(Text, { style: styles.actionBtnText }, "Create Profile")))))));
}
const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436", marginBottom: 15 },
  trackerSection: { paddingHorizontal: 15, marginBottom: 15, marginTop: 15 },
  trackerScroll: { paddingVertical: 10 },
  childDetailCard: { backgroundColor: "#FFF", width: 200, minHeight: 140, padding: 15, borderRadius: 20, marginRight: 15, elevation: 2, borderWidth: 1, borderColor: "#EEE" },
  childHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  detailName: { fontWeight: "bold", fontSize: 16, color: "#2D3436" },
  detailTokens: { color: "#00B894", fontWeight: "bold" },
  statsMiniRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  statBox: { flex: 0.45, backgroundColor: "#F8F9FA", padding: 8, borderRadius: 10, alignItems: "center" },
  statLabel: { fontSize: 8, color: "#B2BEC3", fontWeight: "bold" },
  statVal: { fontSize: 14, fontWeight: "bold", color: "#2D3436" },
  miniLabel: { fontSize: 10, fontWeight: "bold", color: "#B2BEC3", marginBottom: 5 },
  progressBarBg: { height: 6, backgroundColor: "#E9ECEF", borderRadius: 3 },
  progressBarFill: { height: "100%", backgroundColor: "#6C5CE7", borderRadius: 3 },
  addMemberCard: { width: 140, minHeight: 140, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA", borderRadius: 20, borderWidth: 2, borderColor: "#E9ECEF", borderStyle: "dashed", marginRight: 15 },
  addMemberIconPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#E9ECEF", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  addMemberPlusText: { fontSize: 28, color: "#B2BEC3", fontWeight: "bold", marginTop: -3 },
  addMemberCardText: { color: "#B2BEC3", fontWeight: "bold", fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50, elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.2, shadowRadius: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: "900", color: "#2D3436" },
  closeBtnIcon: { width: 30, height: 30, backgroundColor: "#F1F2F6", borderRadius: 15, justifyContent: "center", alignItems: "center" },
  closeBtnText: { color: "#2D3436", fontWeight: "bold", fontSize: 14 },
  tabContainer: { flexDirection: "row", backgroundColor: "#F8F9FA", borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabBtnActive: { backgroundColor: "#FFF", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  tabText: { fontSize: 14, fontWeight: "700", color: "#A0AEC0" },
  tabTextActive: { color: "#6C5CE7" },
  tabBody: { minHeight: 180 },
  modalSub: { fontSize: 13, color: "#636E72", marginBottom: 20, lineHeight: 18 },
  codeBox: { backgroundColor: "#F4F1FF", paddingVertical: 20, paddingHorizontal: 30, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: "#6C5CE7", alignItems: "center" },
  codeTextLarge: { fontSize: 36, fontWeight: "900", color: "#6C5CE7", letterSpacing: 8 },
  modalInput: { backgroundColor: "#F8F9FA", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 15, fontSize: 16, color: "#2D3436", marginBottom: 20 },
  actionBtnPrimary: { backgroundColor: "#6C5CE7", paddingVertical: 16, width: "100%", borderRadius: 15, alignItems: "center" },
  actionBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 }
});
