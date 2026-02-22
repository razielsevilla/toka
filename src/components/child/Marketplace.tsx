import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

function getRemainingTime(deadline?: number) {
  if (!deadline) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function Marketplace() {
  const { Colors, Typography } = useTheme();
  const { currentUser, marketItems, purchaseItem, setWishlistGoal, openMysteryBox, requestAllowanceCashout, notifications, clearNotifications, auction, placeBid } = useTokaStore();
  const [bidAmount, setBidAmount] = useState('');
  const userTokens = currentUser?.tokens || 0;
  const marketNotifs = notifications.filter(n => n.type === 'market' && !n.read).length;

  const handleMysteryBox = () => {
    const result = openMysteryBox();
    Alert.alert(result === 'Insufficient Tokens' ? 'Oops!' : '🎁 Mystery Box!',
      result === 'Insufficient Tokens' ? 'You need 40 tokens!' : `You got:\n\n${result}`);
  };

  const handleAllowanceExchange = () => {
    Alert.alert('Cash Out', 'Exchange 100 💎 for $10 real cash?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Request', onPress: () => userTokens >= 100 ? requestAllowanceCashout(100) : Alert.alert('Not enough tokens!') }
    ]);
  };

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight, shadowColor: Colors.primary }]}>
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="cart" size={24} color={Colors.primary} />
          <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Marketplace</Text>
        </View>
        {marketNotifs > 0 && <View style={[styles.badge, { backgroundColor: Colors.danger, borderColor: Colors.background }]}><Text style={[styles.badgeText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>{marketNotifs}</Text></View>}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={() => marketNotifs > 0 && clearNotifications('market')}>

        {auction.isActive && (
          <View style={[styles.card, { backgroundColor: Colors.danger + '15', borderColor: Colors.danger, width: 170 }]}>
            <Ionicons name="hammer" size={32} color={Colors.danger} style={{ marginBottom: 10 }} />
            <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]} numberOfLines={2}>{auction.itemName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="diamond" size={14} color={Colors.danger} />
              <Text style={[styles.itemCostSale, { fontFamily: Typography.heading, color: Colors.danger }]}>{auction.highestBid}</Text>
            </View>
            <Text style={[{ fontSize: 9, color: Colors.textDim, fontFamily: Typography.bodyBold, marginBottom: 2 }]}>By: {auction.highestBidder || 'No one'}</Text>
            <Text style={[{ fontSize: 9, color: Colors.textDim, fontFamily: Typography.bodyBold, marginBottom: 10 }]}>{Math.floor(auction.timeLeft / 60)}m {auction.timeLeft % 60}s left</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <TouchableOpacity style={[styles.buyBtn, { flex: 1, backgroundColor: Colors.danger }]} onPress={() => placeBid(auction.highestBid + 10)}><Text style={[styles.buyBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>+10</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.buyBtn, { flex: 1, backgroundColor: Colors.danger }]} onPress={() => placeBid(auction.highestBid + 50)}><Text style={[styles.buyBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>+50</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mystery Box */}
        <View style={[styles.card, { backgroundColor: Colors.tertiary + '12', borderColor: Colors.tertiary }]}>
          <Ionicons name="cube" size={32} color={Colors.tertiary} style={{ marginBottom: 10 }} />
          <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]}>Mystery Box</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            <Ionicons name="diamond" size={12} color={Colors.primary} />
            <Text style={[{ color: Colors.primary, fontFamily: Typography.subheading, fontSize: 14 }]}>40</Text>
          </View>
          <TouchableOpacity style={[styles.buyBtn, { backgroundColor: Colors.tertiary }]} onPress={handleMysteryBox}><Text style={[styles.buyBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Roll!</Text></TouchableOpacity>
        </View>

        {/* Allowance */}
        <View style={[styles.card, { backgroundColor: Colors.secondary + '12', borderColor: Colors.secondary }]}>
          <Ionicons name="cash" size={32} color={Colors.secondary} style={{ marginBottom: 10 }} />
          <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]}>$10 Allowance</Text>
          <Text style={[{ color: Colors.primary, fontFamily: Typography.subheading, fontSize: 12, marginBottom: 10 }]}>100 Spendable</Text>
          <TouchableOpacity style={[styles.buyBtn, { backgroundColor: Colors.secondary }]} onPress={handleAllowanceExchange}><Text style={[styles.buyBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Cash Out</Text></TouchableOpacity>
        </View>

        {marketItems.map(item => {
          const isGoal = currentUser?.activeGoal?.itemId === item.id;
          const goalSavings = isGoal ? (currentUser?.activeGoal?.savedTokens || 0) : 0;
          const canAfford = (userTokens + goalSavings) >= item.cost;
          const onSale = item.saleUntil && item.originalCost && item.saleUntil > Date.now();
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: Colors.surfaceLight, borderColor: isGoal ? Colors.secondary : Colors.surfaceLight }, isGoal && { borderWidth: 2 }]}>
              <Ionicons name={item.cost > 100 ? 'gift' : 'ticket'} size={32} color={Colors.secondary} style={{ marginBottom: 10 }} />
              <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]}>{item.name}</Text>
              {onSale ? (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <View style={[styles.saleTag, { backgroundColor: Colors.danger }]}>
                    <Ionicons name="flash" size={10} color="#FFF" />
                    <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '900' }}>FLASH {getRemainingTime(item.saleUntil)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ textDecorationLine: 'line-through', color: Colors.textDim, fontSize: 12, fontFamily: Typography.subheading }}>{item.originalCost}</Text>
                    <Ionicons name="diamond" size={12} color={Colors.danger} />
                    <Text style={{ color: Colors.danger, fontFamily: Typography.heading, fontSize: 16 }}>{item.cost}</Text>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  <Ionicons name="diamond" size={12} color={Colors.primary} />
                  <Text style={{ color: Colors.primary, fontFamily: Typography.subheading, fontSize: 14 }}>{item.cost}</Text>
                </View>
              )}
              <TouchableOpacity style={[styles.buyBtn, { backgroundColor: canAfford ? Colors.primary : Colors.surfaceLight }, !canAfford && { opacity: 0.5 }]} onPress={() => purchaseItem(item.id)} disabled={!canAfford}>
                <Text style={[styles.buyBtnText, { color: canAfford ? Colors.white : Colors.textDim, fontFamily: Typography.subheading }]}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => !isGoal && setWishlistGoal(item.id)} disabled={isGoal}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                  <Text style={{ fontSize: 11, color: isGoal ? Colors.tertiary : Colors.textDim, fontFamily: Typography.subheading }}>{isGoal ? 'Current Goal' : 'Set Goal'}</Text>
                  <Ionicons name={isGoal ? 'checkmark-circle' : 'star'} size={12} color={isGoal ? Colors.tertiary : Colors.textDim} />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, borderWidth: 1 },
  sectionTitle: { fontSize: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  card: { padding: 15, borderRadius: 20, marginRight: 15, width: 140, alignItems: 'center', borderWidth: 1, elevation: 3 },
  itemName: { fontSize: 13, textAlign: 'center', height: 36 },
  itemCostSale: { fontSize: 18 },
  saleTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginBottom: 4 },
  buyBtn: { paddingVertical: 10, width: '100%', borderRadius: 12, alignItems: 'center', elevation: 2 },
  buyBtnText: { fontSize: 13 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 2 },
  badgeText: { fontSize: 11 },
});