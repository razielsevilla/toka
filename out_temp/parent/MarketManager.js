"use strict";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokaStore } from "../../store/useTokaStore";
export default function MarketManager() {
  const { marketItems, addMarketItem, removeMarketItem, auction, startAuction } = useTokaStore();
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [auctionName, setAuctionName] = useState("");
  const [auctionBid, setAuctionBid] = useState("");
  const handleAddReward = () => {
    if (!itemName || !itemCost) {
      Alert.alert("Error", "Please enter reward name and cost.");
      return;
    }
    addMarketItem({
      name: itemName,
      cost: parseInt(itemCost),
      type: "Custom Reward"
    });
    setItemName("");
    setItemCost("");
  };
  const handleStartAuction = () => {
    if (!auctionName || !auctionBid) {
      Alert.alert("Error", "Please enter auction item name and starting bid.");
      return;
    }
    if (auction.isActive) {
      Alert.alert("Error", "An auction is already running!");
      return;
    }
    startAuction(auctionName, 300, parseInt(auctionBid));
    setAuctionName("");
    setAuctionBid("");
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.section }, /* @__PURE__ */ React.createElement(Text, { style: styles.sectionTitle }, "Manage Market Rewards"), /* @__PURE__ */ React.createElement(View, { style: styles.addRewardForm }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: [styles.input, { flex: 0.6, marginBottom: 0 }],
      placeholder: "New Reward",
      placeholderTextColor: "#999",
      value: itemName,
      onChangeText: setItemName
    }
  ), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: [styles.input, { flex: 0.25, marginBottom: 0 }],
      placeholder: "Cost",
      keyboardType: "numeric",
      value: itemCost,
      onChangeText: setItemCost
    }
  ), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.addBtnSmall, onPress: handleAddReward }, /* @__PURE__ */ React.createElement(Text, { style: styles.addBtnText }, "+"))), marketItems.map((item) => /* @__PURE__ */ React.createElement(View, { key: item.id, style: styles.marketEditRow }, /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: styles.marketItemName }, item.name), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 12, color: "#00B894" }), /* @__PURE__ */ React.createElement(Text, { style: styles.marketItemCost }, item.cost))), /* @__PURE__ */ React.createElement(TouchableOpacity, { onPress: () => removeMarketItem(item.id) }, /* @__PURE__ */ React.createElement(Text, { style: styles.removeText }, "Remove")))), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 25, marginBottom: 15 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "hammer", size: 20, color: "#2D3436" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.sectionTitle, { marginBottom: 0 }] }, "Start an Auction")), auction.isActive ? /* @__PURE__ */ React.createElement(View, { style: styles.activeAuctionBox }, /* @__PURE__ */ React.createElement(Text, { style: styles.auctionTitle }, "Currently Auctioning: ", auction.itemName), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 4, marginVertical: 3 } }, /* @__PURE__ */ React.createElement(Text, { style: styles.auctionDetails }, "Highest Bid:"), /* @__PURE__ */ React.createElement(Ionicons, { name: "diamond", size: 12, color: "#636E72" }), /* @__PURE__ */ React.createElement(Text, { style: styles.auctionDetails }, auction.highestBid, " by ", auction.highestBidder || "No one")), /* @__PURE__ */ React.createElement(Text, { style: styles.auctionDetails }, "Time Left: ", Math.floor(auction.timeLeft / 60), "m ", auction.timeLeft % 60, "s")) : /* @__PURE__ */ React.createElement(View, { style: styles.addRewardForm }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: [styles.input, { flex: 0.6, marginBottom: 0 }],
      placeholder: "Auction Item",
      placeholderTextColor: "#999",
      value: auctionName,
      onChangeText: setAuctionName
    }
  ), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: [styles.input, { flex: 0.25, marginBottom: 0 }],
      placeholder: "Start Bid",
      keyboardType: "numeric",
      value: auctionBid,
      onChangeText: setAuctionBid
    }
  ), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: [styles.addBtnSmall, { backgroundColor: "#FF7675" }], onPress: handleStartAuction }, /* @__PURE__ */ React.createElement(Ionicons, { name: "rocket", size: 20, color: "white" }))));
}
const styles = StyleSheet.create({
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436", marginBottom: 15 },
  input: { backgroundColor: "#F1F2F6", borderRadius: 10, padding: 12, fontSize: 14, color: "#2D3436", marginBottom: 15 },
  addRewardForm: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  addBtnSmall: { backgroundColor: "#6C5CE7", width: 45, height: 45, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "white", fontSize: 24, fontWeight: "bold" },
  marketEditRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F1F2F6" },
  marketItemName: { fontSize: 14, fontWeight: "600", color: "#2D3436" },
  marketItemCost: { fontSize: 12, color: "#00B894", fontWeight: "bold" },
  removeText: { color: "#D63031", fontSize: 12, fontWeight: "bold" },
  activeAuctionBox: { backgroundColor: "#FFEAA7", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#FDCB6E" },
  auctionTitle: { fontSize: 14, fontWeight: "800", color: "#2D3436", marginBottom: 5 },
  auctionDetails: { fontSize: 12, color: "#636E72", fontWeight: "600" }
});
