import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from '../store/useTokaStore';

// --- HELPER COMPONENT: NOTIFICATION BADGE ---
const Badge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};

export default function ChildDashboard() {
  const { 
    currentUser, tasks, marketItems, transactions, mockUsers, notifications,
    acceptTask, submitTask, purchaseItem, setWishlistGoal, clearNotifications,
    depositToVault, withdrawFromVault, vaultBalance 
  } = useTokaStore();

  const [showHistory, setShowHistory] = useState(false);

  // --- FILTERS & LOGIC ---
  const myTasks = tasks.filter(t => t.assignedTo.includes(currentUser?.id || '') && t.status !== 'completed');
  const availablePool = tasks.filter(t => t.type === 'spontaneous' && t.status === 'open' && t.assignedTo.length === 0);
  const leaderboard = [...mockUsers].sort((a, b) => b.tokens - a.tokens);

  // Notification Counts
  const taskNotifs = notifications.filter(n => n.type === 'task' && !n.read).length;
  const marketNotifs = notifications.filter(n => n.type === 'market' && !n.read).length;
  const rejectNotifs = notifications.filter(n => n.type === 'rejection' && !n.read).length;

  // Wishlist Progress
  const wishlistId = currentUser?.wishlist[0] || 'm1'; 
  const goalItem = marketItems.find(i => i.id === wishlistId) || marketItems[0];
  const progress = Math.min((currentUser?.tokens || 0) / goalItem.cost, 1);

  const handleVerify = async (taskId: string) => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) {
      submitTask(taskId, result.assets[0].uri);
      // Clear rejection notifs if this was a resubmission
      clearNotifications('rejection');
      Alert.alert("Sent for Review!", "Mom or Dad will check it soon.");
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 40 }}
      onScrollBeginDrag={() => {
        // Clear notifications when the child starts interacting with the dashboard
        if (taskNotifs > 0) clearNotifications('task');
      }}
    >
      
      {/* 1. THE TOKEN WALLET */}
      <View style={styles.walletCard}>
        <View>
          <Text style={styles.walletLabel}>MY BALANCE</Text>
          <Text style={styles.walletAmount}>💎 {currentUser?.tokens}</Text>
        </View>
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(true)}>
          <Text style={styles.historyBtnText}>History 📜</Text>
        </TouchableOpacity>
      </View>

      {/* 2. LEADERBOARD RANKING */}
      <View style={styles.leaderboardCard}>
        <Text style={styles.sectionTitleWhite}>🏆 Household Ranking</Text>
        {leaderboard.slice(0, 3).map((u, index) => (
          <View key={u.id} style={styles.leaderRow}>
            <Text style={styles.rankText}>{index + 1}. {u.name.split(' ')[0]} {u.id === currentUser?.id ? '(Me)' : ''}</Text>
            <Text style={styles.rankTokens}>{u.tokens} 💎</Text>
          </View>
        ))}
      </View>

      {/* 3. WISHLIST PROGRESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Goal: {goalItem.name}</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressSubtext}>
          {currentUser?.tokens} / {goalItem.cost} Tokens ({Math.floor(progress * 100)}%)
        </Text>
      </View>

      {/* 4. THE MARKETPLACE */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>🛒 Marketplace</Text>
          <Badge count={marketNotifs} />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.marketScroll}
          onScroll={() => marketNotifs > 0 && clearNotifications('market')}
        >
          {marketItems.map(item => (
            <View key={item.id} style={styles.marketItemCard}>
              <Text style={styles.itemEmoji}>{item.cost > 100 ? '🎁' : '🎟️'}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCost}>💎 {item.cost}</Text>
              <TouchableOpacity 
                style={[styles.buyBtn, (currentUser?.tokens || 0) < item.cost && styles.disabledBtn]} 
                onPress={() => purchaseItem(item.id)}
              >
                <Text style={styles.buyBtnText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setWishlistGoal(item.id)}>
                <Text style={styles.wishlistLink}>Set Goal ⭐</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 5. MY CHORES & POOL */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>My Chores</Text>
          <Badge count={rejectNotifs + taskNotifs} />
        </View>

        {myTasks.map(task => (
           <View key={task.id} style={[styles.taskCard, task.rejectionReason ? styles.rejectedBorder : null]}>
             <View style={styles.rowBetween}>
               <Text style={styles.taskTitle}>{task.title}</Text>
               <Text style={styles.taskReward}>💎 {task.reward}</Text>
             </View>
             
             {task.rejectionReason && (
               <View style={styles.rejectionBox}>
                 <Text style={styles.rejectionText}>❌ Parent Note: "{task.rejectionReason}"</Text>
               </View>
             )}

             <TouchableOpacity 
               style={styles.verifyBtn} 
               onPress={() => handleVerify(task.id)}
             >
               <Text style={styles.btnText}>
                 {task.status === 'pending' ? 'Reviewing...' : task.rejectionReason ? 'Fix & Re-Submit 📸' : 'Snap Proof 📸'}
               </Text>
             </TouchableOpacity>
           </View>
        ))}

        {availablePool.map(task => (
          <View key={task.id} style={styles.poolCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <TouchableOpacity style={styles.claimBtn} onPress={() => acceptTask(task.id, currentUser?.id || '')}>
              <Text style={styles.btnText}>Claim for 💎 {task.reward}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 6. VAULT SECTION */}
      <View style={[styles.section, {backgroundColor: '#6C5CE7'}]}>
        <Text style={styles.sectionTitleWhite}>🏦 Toka Vault</Text>
        <Text style={styles.vaultBalance}>💎 {vaultBalance}</Text>
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.vaultBtn} onPress={() => depositToVault(50)}>
            <Text style={styles.btnText}>Save 50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.vaultBtn} onPress={() => withdrawFromVault(50)}>
            <Text style={styles.btnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 7. ACTIVITY MODAL */}
      <Modal visible={showHistory} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Activity History</Text>
          <ScrollView>
            {transactions.map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <Text style={tx.type === 'earn' ? styles.txEarn : styles.txSpend}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                </Text>
                <Text style={styles.txReason}>{tx.reason}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHistory(false)}>
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436' },
  sectionTitleWhite: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Badge
  badgeContainer: { backgroundColor: '#D63031', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },

  // Wallet
  walletCard: { backgroundColor: '#6C5CE7', padding: 25, borderRadius: 25, margin: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 5 },
  walletLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  walletAmount: { color: '#FFF', fontSize: 32, fontWeight: '900' },
  historyBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  historyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // Leaderboard
  leaderboardCard: { backgroundColor: '#FDCB6E', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  leaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rankText: { fontWeight: 'bold', color: '#2D3436' },
  rankTokens: { fontWeight: 'bold', color: '#D35400' },

  // Marketplace
  marketScroll: { marginTop: 10 },
  marketItemCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginRight: 15, width: 130, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  itemEmoji: { fontSize: 30, marginBottom: 5 },
  itemName: { fontSize: 12, fontWeight: '700', textAlign: 'center', height: 32 },
  itemCost: { color: '#00B894', fontWeight: 'bold', marginVertical: 5 },
  buyBtn: { backgroundColor: '#FDCB6E', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10 },
  buyBtnText: { fontWeight: 'bold', fontSize: 12 },
  disabledBtn: { opacity: 0.3 },
  wishlistLink: { fontSize: 9, color: '#6C5CE7', marginTop: 8, fontWeight: 'bold' },

  // Tasks
  taskCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, marginBottom: 10 },
  rejectedBorder: { borderLeftWidth: 6, borderLeftColor: '#D63031', backgroundColor: '#FFF5F5' },
  rejectionBox: { backgroundColor: '#FFEAEA', padding: 10, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#FAB1A0', borderStyle: 'dashed' },
  rejectionText: { color: '#D63031', fontSize: 12, fontWeight: 'bold', fontStyle: 'italic' },
  taskTitle: { fontSize: 15, fontWeight: '700' },
  taskReward: { color: '#0984E3', fontWeight: 'bold' },
  verifyBtn: { backgroundColor: '#6C5CE7', padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  
  // Pool & Vault
  poolCard: { backgroundColor: '#E1F5FE', padding: 15, borderRadius: 15, marginBottom: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#03A9F4' },
  claimBtn: { backgroundColor: '#03A9F4', padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  vaultBalance: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginVertical: 15 },
  vaultBtn: { flex: 0.48, backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 10, alignItems: 'center' },

  // Shared
  btnText: { color: 'white', fontWeight: 'bold' },
  progressBg: { height: 10, backgroundColor: '#F1F2F6', borderRadius: 5, marginVertical: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00B894' },
  progressSubtext: { fontSize: 11, color: '#636E72', textAlign: 'center' },
  modalContainer: { flex: 1, padding: 30, backgroundColor: '#FFF' },
  modalTitle: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
  txRow: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  txEarn: { color: '#00B894', fontWeight: 'bold', width: 50 },
  txSpend: { color: '#D63031', fontWeight: 'bold', width: 50 },
  txReason: { flex: 1, color: '#2D3436' },
  closeBtn: { backgroundColor: '#2D3436', padding: 15, borderRadius: 15, marginTop: 20, alignItems: 'center' }
});