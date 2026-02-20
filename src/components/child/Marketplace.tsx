import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function Marketplace() {
  const { currentUser, marketItems, purchaseItem, setWishlistGoal, openMysteryBox, withdrawFromVault, vaultBalance, notifications, clearNotifications } = useTokaStore();
  
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
      { text: "Send Request", onPress: () => vaultBalance >= 100 ? withdrawFromVault(100) : Alert.alert("Not enough savings!") }
    ]);
  };

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>🛒 Marketplace</Text>
        {marketNotifs > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{marketNotifs}</Text></View>}
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={() => marketNotifs > 0 && clearNotifications('market')}>
        <View style={[styles.marketItemCard, styles.specialCardGacha]}>
          <Text style={styles.itemEmoji}>📦</Text>
          <Text style={styles.itemName}>Mystery Box</Text>
          <Text style={styles.itemCost}>💎 40</Text>
          <TouchableOpacity style={styles.buyBtn} onPress={handleMysteryBox}><Text style={styles.buyBtnText}>Roll Gacha!</Text></TouchableOpacity>
        </View>

        <View style={[styles.marketItemCard, styles.specialCardCash]}>
          <Text style={styles.itemEmoji}>💵</Text>
          <Text style={styles.itemName}>$10 Allowance</Text>
          <Text style={styles.itemCost}>💎 100 Vault</Text>
          <TouchableOpacity style={styles.buyBtn} onPress={handleAllowanceExchange}><Text style={styles.buyBtnText}>Cash Out</Text></TouchableOpacity>
        </View>

        {marketItems.map(item => (
          <View key={item.id} style={styles.marketItemCard}>
            <Text style={styles.itemEmoji}>{item.cost > 100 ? '🎁' : '🎟️'}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCost}>💎 {item.cost}</Text>
            <TouchableOpacity 
              style={[styles.buyBtn, userTokens < item.cost && styles.disabledBtn]} 
              onPress={() => purchaseItem(item.id)}
              disabled={userTokens < item.cost}
            ><Text style={styles.buyBtnText}>Buy</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setWishlistGoal(item.id)}><Text style={styles.wishlistLink}>Set Goal ⭐</Text></TouchableOpacity>
          </View>
        ))}
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
  itemEmoji: { fontSize: 32, marginBottom: 5 },
  itemName: { fontSize: 12, fontWeight: '800', textAlign: 'center', height: 34, color: '#2D3436' },
  itemCost: { color: '#0984E3', fontWeight: '900', fontSize: 13, marginBottom: 10 },
  buyBtn: { backgroundColor: '#FDCB6E', paddingVertical: 8, width: '100%', borderRadius: 10, alignItems: 'center' },
  buyBtnText: { fontWeight: 'bold', fontSize: 12, color: '#2D3436' },
  disabledBtn: { opacity: 0.4 },
  wishlistLink: { fontSize: 10, color: '#6C5CE7', marginTop: 10, fontWeight: 'bold' },
  badge: { backgroundColor: '#D63031', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
});