import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';

export default function WishlistHero() {
  const { currentUser, marketItems, fundGoal, purchaseItem } = useTokaStore();
  const [depositAmount, setDepositAmount] = useState('');

  const activeGoal = currentUser?.activeGoal;
  const userTokens = currentUser?.tokens || 0;

  // If no goal is set, suggest setting one
  if (!activeGoal) {
    return (
      <View style={styles.goalHeroCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 5 }}>
          <Text style={[styles.emptyGoalText, { marginBottom: 0 }]}>No Savings Goal Set!</Text>
          <Ionicons name="flag" size={18} color="#2D3436" />
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="star" size={12} color="#B2BEC3" />
          <Text style={styles.goalTitle}>My Current Goal</Text>
        </View>
        {progress >= 1 && (
          <View style={{ backgroundColor: '#00B894', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFF' }}>Ready to Buy!</Text>
            <Ionicons name="partly-sunny" size={12} color="#FFF" />
          </View>
        )}
      </View>
      <Text style={styles.goalItemName}>{goalItem.name}</Text>

      <View style={styles.goalStatsRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.goalStatText}>Saved: {saved}</Text>
          <Ionicons name="diamond" size={10} color="#2D3436" />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.goalStatText}>Goal: {cost}</Text>
          <Ionicons name="diamond" size={10} color="#2D3436" />
        </View>
      </View>

      <View style={styles.goalBarBg}>
        <View style={[styles.goalBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 10 }}>
        <Text style={[styles.walletBalanceText, { marginTop: 0 }]}>Wallet Balance: {userTokens}</Text>
        <Ionicons name="diamond" size={10} color="#B2BEC3" />
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
            <Ionicons name="gift" size={16} color="white" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  goalHeroCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2, borderColor: '#FDCB6E' },
  emptyGoalText: { fontSize: 18, fontWeight: '800', color: '#2D3436', textAlign: 'center', marginBottom: 5 },
  emptyGoalSub: { fontSize: 12, color: '#636E72', textAlign: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 12, fontWeight: '800', color: '#B2BEC3', textTransform: 'uppercase' },
  goalReadyText: { fontSize: 10, fontWeight: 'bold', color: '#FFF', backgroundColor: '#00B894', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  goalItemName: { fontSize: 22, fontWeight: '900', color: '#6C5CE7', marginVertical: 8 },
  goalStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalStatText: { fontSize: 12, fontWeight: 'bold', color: '#2D3436' },
  goalBarBg: { height: 14, backgroundColor: '#F1F2F6', borderRadius: 7, overflow: 'hidden' },
  goalBarFill: { height: '100%', backgroundColor: '#00B894', borderRadius: 7 },
  walletBalanceText: { fontSize: 11, fontStyle: 'italic', color: '#B2BEC3', marginTop: 10, textAlign: 'right' },

  depositRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  depositInput: { flex: 0.6, backgroundColor: '#F8F9FA', borderRadius: 10, padding: 10, fontSize: 14, borderWidth: 1, borderColor: '#F1F2F6' },
  depositBtn: { flex: 0.4, backgroundColor: '#FDCB6E', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  depositBtnText: { color: '#2D3436', fontWeight: 'bold', fontSize: 14 },

  purchaseBtn: { width: '100%', backgroundColor: '#00B894', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  purchaseBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});