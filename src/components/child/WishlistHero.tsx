import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { Colors, Typography } from '../../theme/colors';

export default function WishlistHero() {
  const { currentUser, marketItems, fundGoal, purchaseItem } = useTokaStore();
  const [depositAmount, setDepositAmount] = useState('');

  const activeGoal = currentUser?.activeGoal;
  const userTokens = currentUser?.tokens || 0;

  if (!activeGoal) {
    return (
      <View style={styles.goalHeroCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 5 }}>
          <Text style={[styles.emptyGoalText, { marginBottom: 0 }]}>No Savings Goal Set!</Text>
          <Ionicons name="flag" size={18} color={Colors.text} />
        </View>
        <Text style={styles.emptyGoalSub}>Head down to the marketplace and select an item to start working towards.</Text>
      </View>
    );
  }

  const goalItem = marketItems.find(i => i.id === activeGoal.itemId);
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
    setDepositAmount('');
  };

  const handlePurchase = () => {
    // If they purchase, we need to temporarily move their tokens from goal to actual tokens so the stock purchase logic works.
    purchaseItem(goalItem.id);
  };

  return (
    <View style={styles.goalHeroCard}>
      <View style={styles.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="star" size={14} color={Colors.secondary} />
          <Text style={styles.goalTitle}>My Current Goal</Text>
        </View>
        {progress >= 1 && (
          <View style={styles.goalReadyBadge}>
            <Text style={styles.goalReadyText}>Ready to Buy!</Text>
            <Ionicons name="partly-sunny" size={14} color={Colors.background} />
          </View>
        )}
      </View>
      <Text style={styles.goalItemName}>{goalItem.name}</Text>

      <View style={styles.goalStatsRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.goalStatText}>Saved: {saved}</Text>
          <Ionicons name="diamond" size={12} color={Colors.secondary} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.goalStatText}>Goal: {cost}</Text>
          <Ionicons name="diamond" size={12} color={Colors.secondary} />
        </View>
      </View>

      <View style={styles.goalBarBg}>
        <View style={[styles.goalBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 12 }}>
        <Text style={[styles.walletBalanceText, { marginTop: 0 }]}>Wallet Balance: {userTokens}</Text>
        <Ionicons name="diamond" size={12} color={Colors.primary} />
      </View>

      {progress < 1 ? (
        <View style={styles.depositRow}>
          <TextInput
            style={styles.depositInput}
            placeholder="Fund Goal"
            keyboardType="numeric"
            value={depositAmount}
            onChangeText={setDepositAmount}
          />
          <TouchableOpacity style={styles.depositBtn} onPress={handleDeposit}>
            <Text style={styles.depositBtnText}>Deposit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.purchaseBtn} onPress={handlePurchase}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Text style={styles.purchaseBtnText}>Buy Now!</Text>
            <Ionicons name="gift" size={18} color={Colors.background} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  goalHeroCard: { backgroundColor: Colors.surface, padding: 25, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, borderWidth: 2, borderColor: Colors.secondary },
  emptyGoalText: { fontSize: 24, fontFamily: Typography.heading, color: Colors.primary, textAlign: 'center', marginVertical: 10 },
  emptyGoalSub: { fontSize: 13, fontFamily: Typography.body, color: Colors.textDim, textAlign: 'center', lineHeight: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 13, fontFamily: Typography.subheading, color: Colors.textDim, textTransform: 'uppercase', letterSpacing: 1 },
  goalReadyBadge: { backgroundColor: Colors.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  goalReadyText: { fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.background },
  goalItemName: { fontSize: 32, fontFamily: Typography.heading, color: Colors.primary, marginVertical: 12 },
  goalStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalStatText: { fontSize: 14, fontFamily: Typography.subheading, color: Colors.text },
  goalBarBg: { height: 16, backgroundColor: Colors.surfaceLight, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: Colors.surfaceLight },
  goalBarFill: { height: '100%', backgroundColor: Colors.secondary, borderRadius: 8 },
  walletBalanceText: { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.primary, textAlign: 'right' },

  depositRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  depositInput: { flex: 0.6, backgroundColor: Colors.surfaceLight, borderRadius: 12, padding: 12, fontSize: 16, fontFamily: Typography.subheading, color: Colors.text, borderWidth: 1, borderColor: 'rgba(49, 255, 236, 0.2)' },
  depositBtn: { flex: 0.4, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  depositBtnText: { color: Colors.background, fontFamily: Typography.subheading, fontSize: 16 },

  purchaseBtn: { width: '100%', backgroundColor: Colors.secondary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20, elevation: 5 },
  purchaseBtnText: { color: Colors.background, fontFamily: Typography.heading, fontSize: 22, letterSpacing: 1 }
});