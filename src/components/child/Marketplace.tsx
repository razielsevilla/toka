import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';

function getRemainingTime(deadline?: number) {
  if (!deadline) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function Marketplace() {
  const { currentUser, marketItems, purchaseItem, setWishlistGoal, openMysteryBox, requestAllowanceCashout, vaultBalance, notifications, clearNotifications, auction, placeBid } = useTokaStore();

  const [bidAmount, setBidAmount] = useState('');

  const userTokens = currentUser?.tokens || 0;
  const marketNotifs = notifications.filter(n => n.type === 'market' && !n.read).length;

  const handleMysteryBox = () => {
    const result = openMysteryBox();
    Alert.alert(result === 'Insufficient Tokens' ? "Oops!" : "🎁 Mystery Box Opened!",
      result === 'Insufficient Tokens' ? "You need 40 tokens to open a Mystery Box!" : `You got:\n\n${result}`);
  };

  const handleAllowanceExchange = () => {
    Alert.alert("Cash Out Allowance", "Exchange 100 💎 for $10 real cash?", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Request", onPress: () => userTokens >= 100 ? requestAllowanceCashout(100) : Alert.alert("Not enough spendable tokens!") }
    ]);
  };

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="cart" size={20} color="#2D3436" />
          <Text style={styles.sectionTitle}>Marketplace</Text>
        </View>
        {marketNotifs > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{marketNotifs}</Text></View>}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={() => marketNotifs > 0 && clearNotifications('market')}>

        {auction.isActive && (
          <View style={[styles.marketItemCard, styles.auctionCard]}>
            <Ionicons name="hammer" size={32} color="#FF7675" style={styles.itemEmoji} />
            <Text style={styles.itemName} numberOfLines={2}>{auction.itemName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="diamond" size={14} color="#D63031" />
              <Text style={styles.itemCostSale}>{auction.highestBid}</Text>
            </View>
            <Text style={styles.saleTag}>Bid by: {auction.highestBidder || 'No one'}</Text>
            <Text style={styles.saleTag}>Time Left: {Math.floor(auction.timeLeft / 60)}m {auction.timeLeft % 60}s</Text>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.buyBtn, { flex: 1 }]}
                onPress={() => placeBid(auction.highestBid + 10)}
              >
                <Text style={styles.buyBtnText}>Bid +10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buyBtn, { flex: 1 }]}
                onPress={() => placeBid(auction.highestBid + 50)}
              >
                <Text style={styles.buyBtnText}>Bid +50</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={[styles.marketItemCard, styles.specialCardGacha]}>
          <Ionicons name="cube" size={32} color="#A29BFE" style={styles.itemEmoji} />
          <Text style={styles.itemName}>Mystery Box</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            <Ionicons name="diamond" size={12} color="#0984E3" />
            <Text style={[styles.itemCost, { marginBottom: 0 }]}>40</Text>
          </View>
          <TouchableOpacity style={styles.buyBtn} onPress={handleMysteryBox}><Text style={styles.buyBtnText}>Roll Gacha!</Text></TouchableOpacity>
        </View>

        <View style={[styles.marketItemCard, styles.specialCardCash]}>
          <Ionicons name="cash" size={32} color="#00B894" style={styles.itemEmoji} />
          <Text style={styles.itemName}>$10 Allowance</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            <Ionicons name="diamond" size={12} color="#0984E3" />
            <Text style={[styles.itemCost, { marginBottom: 0 }]}>100 Spendables</Text>
          </View>
          <TouchableOpacity style={styles.buyBtn} onPress={handleAllowanceExchange}><Text style={styles.buyBtnText}>Cash Out</Text></TouchableOpacity>
        </View>

        {marketItems.map(item => {
          const isGoal = currentUser?.activeGoal?.itemId === item.id;
          const goalSavings = isGoal ? (currentUser?.activeGoal?.savedTokens || 0) : 0;
          const canAfford = (userTokens + goalSavings) >= item.cost;

          return (
            <View key={item.id} style={[styles.marketItemCard, isGoal && styles.activeGoalCard]}>
              <Ionicons name={item.cost > 100 ? 'gift' : 'ticket'} size={32} color="#FDCB6E" style={styles.itemEmoji} />
              <Text style={styles.itemName}>{item.name}</Text>

              {item.saleUntil && item.originalCost && item.saleUntil > Date.now() ? (
                <View style={styles.saleContainer}>
                  <View style={[styles.saleTag, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                    <Ionicons name="flash" size={10} color="#FFF" />
                    <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '900' }}>FLASH {getRemainingTime(item.saleUntil)}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.originalCost}>{item.originalCost}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="diamond" size={12} color="#D63031" />
                      <Text style={styles.itemCostSale}>{item.cost}</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  <Ionicons name="diamond" size={12} color="#0984E3" />
                  <Text style={[styles.itemCost, { marginBottom: 0 }]}>{item.cost}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.buyBtn, !canAfford && styles.disabledBtn]}
                onPress={() => purchaseItem(item.id)}
                disabled={!canAfford}
              >
                <Text style={styles.buyBtnText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => !isGoal && setWishlistGoal(item.id)} disabled={isGoal}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                  <Text style={[styles.wishlistLink, isGoal && { color: '#00B894' }, { marginTop: 0 }]}>
                    {isGoal ? "Current Goal" : "Set Goal"}
                  </Text>
                  <Ionicons name={isGoal ? "checkmark-circle" : "star"} size={12} color={isGoal ? "#00B894" : "#6C5CE7"} />
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
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  marketItemCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginRight: 15, width: 130, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  specialCardGacha: { borderColor: '#A29BFE', backgroundColor: '#F4F1FF', borderWidth: 2 },
  specialCardCash: { borderColor: '#00B894', backgroundColor: '#E6FCF5', borderWidth: 2 },
  auctionCard: { borderColor: '#FF7675', backgroundColor: '#FFEAA7', borderWidth: 2, width: 160 },
  itemEmoji: { marginBottom: 5 },
  itemName: { fontSize: 12, fontWeight: '800', textAlign: 'center', height: 34, color: '#2D3436' },
  itemCost: { color: '#0984E3', fontWeight: '900', fontSize: 13, marginBottom: 10 },
  itemCostSale: { color: '#D63031', fontWeight: '900', fontSize: 14 },
  saleContainer: { alignItems: 'center', marginBottom: 10 },
  saleTag: { backgroundColor: '#FF7675', color: '#FFF', fontSize: 8, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  originalCost: { textDecorationLine: 'line-through', color: '#B2BEC3', fontSize: 11, fontWeight: 'bold' },
  buyBtn: { backgroundColor: '#FDCB6E', paddingVertical: 8, width: '100%', borderRadius: 10, alignItems: 'center' },
  buyBtnText: { fontWeight: 'bold', fontSize: 12, color: '#2D3436' },
  disabledBtn: { opacity: 0.4 },
  wishlistLink: { fontSize: 10, color: '#6C5CE7', marginTop: 10, fontWeight: 'bold' },
  activeGoalCard: { borderColor: '#FDCB6E', borderWidth: 2 },
  badge: { backgroundColor: '#D63031', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
});