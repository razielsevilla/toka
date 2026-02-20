import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function WishlistHero() {
  const { currentUser, marketItems } = useTokaStore();

  const wishlistId = currentUser?.wishlist[0] || 'm1'; 
  const goalItem = marketItems.find(i => i.id === wishlistId) || marketItems[0];
  const userTokens = currentUser?.tokens || 0;
  const progress = Math.min(userTokens / (goalItem?.cost || 1), 1);

  if (!goalItem) return null;

  return (
    <View style={styles.goalHeroCard}>
      <View style={styles.rowBetween}>
        <Text style={styles.goalTitle}>⭐ My Current Goal</Text>
        {progress >= 1 && <Text style={styles.goalReadyText}>Ready to Buy! 🎉</Text>}
      </View>
      <Text style={styles.goalItemName}>{goalItem.name}</Text>
      
      <View style={styles.goalStatsRow}>
        <Text style={styles.goalStatText}>Saved: {userTokens} 💎</Text>
        <Text style={styles.goalStatText}>Goal: {goalItem.cost} 💎</Text>
      </View>
      
      <View style={styles.goalBarBg}>
        <View style={[styles.goalBarFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalHeroCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2, borderColor: '#FDCB6E' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 12, fontWeight: '800', color: '#B2BEC3', textTransform: 'uppercase' },
  goalReadyText: { fontSize: 10, fontWeight: 'bold', color: '#FFF', backgroundColor: '#00B894', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  goalItemName: { fontSize: 22, fontWeight: '900', color: '#6C5CE7', marginVertical: 8 },
  goalStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalStatText: { fontSize: 12, fontWeight: 'bold', color: '#2D3436' },
  goalBarBg: { height: 14, backgroundColor: '#F1F2F6', borderRadius: 7, overflow: 'hidden' },
  goalBarFill: { height: '100%', backgroundColor: '#00B894', borderRadius: 7 },
});