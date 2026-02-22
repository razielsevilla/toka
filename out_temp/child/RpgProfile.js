"use strict";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function RpgProfile() {
  const { currentUser, user } = useTokaStore();
  const activeUser = currentUser || user;
  const xp = activeUser.xp || 0;
  const level = activeUser.level || 1;
  const badges = activeUser.badges || ["Seedling"];
  const xpNeeded = level * 500;
  const currentLevelXp = xp % 500;
  const progress = currentLevelXp / 500;
  return /* @__PURE__ */ React.createElement(View, { style: styles.section }, /* @__PURE__ */ React.createElement(View, { style: styles.headerRow }, /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "shield-checkmark", size: 20, color: "#2D3436" }), /* @__PURE__ */ React.createElement(Text, { style: styles.sectionTitle }, "RPG Profile")), /* @__PURE__ */ React.createElement(View, { style: styles.levelBadge }, /* @__PURE__ */ React.createElement(Text, { style: styles.levelText }, "Lv. ", level))), /* @__PURE__ */ React.createElement(Text, { style: styles.xpText }, xp, " Total XP"), /* @__PURE__ */ React.createElement(View, { style: styles.xpBarBg }, /* @__PURE__ */ React.createElement(View, { style: [styles.xpBarFill, { width: `${progress * 100}%` }] })), /* @__PURE__ */ React.createElement(Text, { style: styles.xpSubtext }, currentLevelXp, " / 500 XP to Level ", level + 1), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "trophy", size: 16, color: "#2D3436" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.badgesTitle, { marginBottom: 0 }] }, "Badges Earned")), /* @__PURE__ */ React.createElement(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: styles.badgesWrapper }, badges.map((b, i) => /* @__PURE__ */ React.createElement(View, { key: i, style: styles.badgeCard }, /* @__PURE__ */ React.createElement(View, { style: styles.badgeIconBg }, getBadgeIcon(b)), /* @__PURE__ */ React.createElement(Text, { style: styles.badgeName }, b)))));
}
function getBadgeIcon(badge) {
  if (badge === "Seedling") return /* @__PURE__ */ React.createElement(Ionicons, { name: "leaf", size: 24, color: "#00B894" });
  if (badge === "First Chore!") return /* @__PURE__ */ React.createElement(Ionicons, { name: "gift", size: 24, color: "#E17055" });
  if (badge === "Rising Star") return /* @__PURE__ */ React.createElement(Ionicons, { name: "star", size: 24, color: "#FDCB6E" });
  if (badge === "Chore Master") return /* @__PURE__ */ React.createElement(Ionicons, { name: "medal", size: 24, color: "#6C5CE7" });
  return /* @__PURE__ */ React.createElement(Ionicons, { name: "ribbon", size: 24, color: "#D63031" });
}
const styles = StyleSheet.create({
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#2D3436" },
  levelBadge: { backgroundColor: "#6C5CE7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  levelText: { color: "#FFF", fontWeight: "900", fontSize: 14 },
  xpText: { fontSize: 16, fontWeight: "800", color: "#6C5CE7", marginTop: 15 },
  xpBarBg: { height: 10, backgroundColor: "#F1F2F6", borderRadius: 5, overflow: "hidden", marginVertical: 8 },
  xpBarFill: { height: "100%", backgroundColor: "#00B894", borderRadius: 5 },
  xpSubtext: { fontSize: 11, color: "#B2BEC3", fontWeight: "700", textAlign: "right", marginBottom: 20 },
  badgesTitle: { fontSize: 14, fontWeight: "800", color: "#2D3436", marginBottom: 10 },
  badgesWrapper: { flexDirection: "row" },
  badgeCard: { backgroundColor: "#FDCB6E", padding: 15, borderRadius: 15, marginRight: 10, alignItems: "center", minWidth: 85, elevation: 2 },
  badgeIconBg: { marginBottom: 8, backgroundColor: "rgba(255,255,255,0.8)", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  badgeName: { fontSize: 11, fontWeight: "900", color: "#D35400", textAlign: "center" }
});
