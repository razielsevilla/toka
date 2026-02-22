"use strict";
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useTokaStore } from "../../store/useTokaStore";
export default function MiniGames() {
  const { playDoubleOrNothing, currentUser, user } = useTokaStore();
  const [wager, setWager] = useState("");
  const animationRef = useRef(null);
  const activeUser = currentUser || user;
  const tokens = activeUser.tokens || 0;
  const handlePlay = () => {
    const wagerAmount = parseInt(wager, 10);
    if (isNaN(wagerAmount) || wagerAmount <= 0) {
      Alert.alert("Invalid Wager", "Please enter a valid amount.");
      return;
    }
    if (wagerAmount > tokens) {
      Alert.alert("Not Enough Tokens", `You only have ${tokens} \u{1F48E} to play with.`);
      return;
    }
    Alert.alert(
      "Double or Nothing! \u{1F3B2}",
      `Are you sure you want to risk ${wagerAmount} \u{1F48E}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Roll the Dice!",
          onPress: () => {
            const result = playDoubleOrNothing(wagerAmount);
            if (result === "win") {
              animationRef.current?.play();
              setTimeout(() => {
                Alert.alert("\u{1F389} YOU WON! \u{1F389}", `Awesome! You just doubled your wager and earned ${wagerAmount} \u{1F48E}!`);
              }, 1e3);
            } else {
              Alert.alert("\u{1F622} Oh no!", `You lost ${wagerAmount} \u{1F48E}. Better luck next time!`);
            }
            setWager("");
          }
        }
      ]
    );
  };
  return /* @__PURE__ */ React.createElement(View, { style: styles.container }, /* @__PURE__ */ React.createElement(View, { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: "none", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
    LottieView,
    {
      ref: animationRef,
      source: require("../../../assets/lottie/success.json"),
      loop: false,
      style: { width: 150, height: 150 }
    }
  )), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 } }, /* @__PURE__ */ React.createElement(Ionicons, { name: "dice", size: 20, color: "#6C5CE7" }), /* @__PURE__ */ React.createElement(Text, { style: [styles.title, { marginBottom: 0 }] }, "Double or Nothing")), /* @__PURE__ */ React.createElement(Text, { style: styles.subtitle }, "Feeling lucky? Risk your tokens for a chance to instantly double them!"), /* @__PURE__ */ React.createElement(View, { style: styles.formRow }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      style: styles.input,
      placeholder: "Enter wager",
      keyboardType: "numeric",
      value: wager,
      onChangeText: setWager
    }
  ), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: styles.playBtn, onPress: handlePlay }, /* @__PURE__ */ React.createElement(Text, { style: styles.playBtnText }, "Play!"))));
}
const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2, borderColor: "#A29BFE" },
  title: { fontSize: 18, fontWeight: "900", color: "#6C5CE7", marginBottom: 5 },
  subtitle: { fontSize: 12, color: "#636E72", marginBottom: 15 },
  formRow: { flexDirection: "row", gap: 10 },
  input: { flex: 0.6, backgroundColor: "#F4F1FF", borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: "#A29BFE", color: "#2D3436" },
  playBtn: { flex: 0.4, backgroundColor: "#6C5CE7", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  playBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 }
});
