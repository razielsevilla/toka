"use strict";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function Leaderboard() {
  const { currentUser, mockUsers } = useTokaStore();
  const sortedUsers = [...mockUsers].sort((a, b) => b.tokens - a.tokens);
  return /* @__PURE__ */ React.createElement(View, { style: styles.leaderboardCard }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "trophy", size: 20, color: "#FFF" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.sectionTitleWhite, { marginBottom: 0 }] }, "Household Ranking")), sortedUsers.slice(0, 3).map((u, index) => /* @__PURE__ */ React.createElement(View, { key: u.id, style: styles.leaderRow }, /* @__PURE__ */ React.createElement(Text, { style: styles.rankText }, index + 1, ". ", u.name.split(" ")[0], " ", u.id === currentUser?.id ? "(Me)" : ""), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.rankTokens }, u.tokens), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 12, color: "#D35400" })))));
}
const styles = StyleSheet.create({
  leaderboardCard: { backgroundColor: "#FDCB6E", padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15 },
  sectionTitleWhite: { fontSize: 18, fontWeight: "800", color: "#FFF", marginBottom: 10 },
  leaderRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  rankText: { fontWeight: "bold", color: "#2D3436" },
  rankTokens: { fontWeight: "bold", color: "#D35400" }
});
