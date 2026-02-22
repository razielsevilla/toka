import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function WishlistHero() {
  const { Colors, Typography } = useTheme();
  const { currentUser, marketItems, fundGoal, purchaseItem } = useTokaStore();
  const [depositAmount, setDepositAmount] = useState('');

  const activeGoal = currentUser?.activeGoal;
  const userTokens = currentUser?.tokens || 0;

  if (!activeGoal) {
    return (
      <View style={[styles.card, { backgroundColor: Colors.surface, borderColor: Colors.secondary, shadowColor: Colors.primary }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 5 }}>
          <Text style={[styles.emptyGoalText, { fontFamily: Typography.heading, color: Colors.primary }]}>No Savings Goal Set!</Text>
          <Ionicons name="flag" size={18} color={Colors.textDim} />
        </View>
        <Text style={[styles.emptyGoalSub, { fontFamily: Typography.body, color: Colors.textDim }]}>Head to the Marketplace and tap "Set Goal" on any item.</Text>
      </View>
    );
  }

  const goalItem = marketItems.find(i => i.id === activeGoal.itemId);
  if (!goalItem) return null;

  const cost = goalItem.cost;
  const saved = activeGoal.savedTokens;
  const progress = Math.min(saved / cost, 1);

  const handleDeposit = () => {
    const amount = parseInt(depositAmount, 10);
    if (!amount || isNaN(amount) || amount <= 0) { Alert.alert('Invalid Input', 'Please enter a valid amount.'); return; }
    if (amount > userTokens) { Alert.alert('Not Enough Tokens', `You only have ${userTokens} tokens!`); return; }
    fundGoal(amount); setDepositAmount('');
  };

  return (
    <View style={[styles.card, { backgroundColor: Colors.surface, borderColor: Colors.secondary, shadowColor: Colors.primary }]}>
      <View style={styles.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="star" size={14} color={Colors.secondary} />
          <Text style={[styles.goalTitle, { fontFamily: Typography.subheading, color: Colors.textDim }]}>My Current Goal</Text>
        </View>
        {progress >= 1 && (
          <View style={[styles.readyBadge, { backgroundColor: Colors.tertiary }]}>
            <Text style={[styles.readyText, { fontFamily: Typography.bodyBold, color: Colors.white }]}>Ready to Buy!</Text>
          </View>
        )}
      </View>
      <Text style={[styles.goalItemName, { fontFamily: Typography.heading, color: Colors.primary }]}>{goalItem.name}</Text>

      <View style={styles.rowBetween}>
        <Text style={[styles.goalStatText, { fontFamily: Typography.subheading, color: Colors.text }]}>Saved: {saved} 💎</Text>
        <Text style={[styles.goalStatText, { fontFamily: Typography.subheading, color: Colors.text }]}>Goal: {cost} 💎</Text>
      </View>

      <View style={[styles.barBg, { backgroundColor: Colors.surfaceLight }]}>
        <View style={[styles.barFill, { width: `${progress * 100}%` as any, backgroundColor: Colors.secondary }]} />
      </View>

      <Text style={[styles.walletText, { fontFamily: Typography.bodyMedium, color: Colors.primary }]}>Wallet: {userTokens} 💎</Text>

      {progress < 1 ? (
        <View style={styles.depositRow}>
          <TextInput
            style={[styles.depositInput, { backgroundColor: Colors.surfaceLight, color: Colors.text, borderColor: Colors.primary + '33', fontFamily: Typography.subheading }]}
            placeholder="Fund Goal"
            placeholderTextColor={Colors.textDim}
            keyboardType="numeric"
            value={depositAmount}
            onChangeText={setDepositAmount}
          />
          <TouchableOpacity style={[styles.depositBtn, { backgroundColor: Colors.primary }]} onPress={handleDeposit}>
            <Text style={[styles.depositBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Deposit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.purchaseBtn, { backgroundColor: Colors.secondary }]} onPress={() => purchaseItem(goalItem.id)}>
          <Text style={[styles.purchaseBtnText, { color: Colors.white, fontFamily: Typography.heading }]}>Buy Now! 🎁</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 25, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 10, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 10, borderWidth: 2 },
  emptyGoalText: { fontSize: 22, textAlign: 'center', marginVertical: 10 },
  emptyGoalSub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  readyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  readyText: { fontSize: 11 },
  goalItemName: { fontSize: 32, marginVertical: 10 },
  goalStatText: { fontSize: 14, marginBottom: 12 },
  barBg: { height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 12 },
  barFill: { height: '100%', borderRadius: 7 },
  walletText: { fontSize: 13, textAlign: 'right', marginBottom: 4 },
  depositRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  depositInput: { flex: 0.6, borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1 },
  depositBtn: { flex: 0.4, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  depositBtnText: { fontSize: 16 },
  purchaseBtn: { width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20, elevation: 5 },
  purchaseBtnText: { fontSize: 22, letterSpacing: 1 },
});