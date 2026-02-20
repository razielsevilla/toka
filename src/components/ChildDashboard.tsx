import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, Modal, TextInput } from 'react-native';
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
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [bankAmount, setBankAmount] = useState('');

  // --- LOGIC: FILTERS ---
  const myTasks = tasks.filter(t => t.assignedTo.includes(currentUser?.id || '') && t.status !== 'completed');
  const availablePool = tasks.filter(t => t.type === 'spontaneous' && t.status === 'open' && t.assignedTo.length === 0);
  const leaderboard = [...mockUsers].sort((a, b) => b.tokens - a.tokens);

  // Tab Filtering Logic
  const filteredTasks = myTasks.filter(t => {
    if (activeTab === 'daily') return t.frequency === 'daily' || t.type === 'spontaneous';
    return t.frequency === activeTab;
  });

  // Notification Counts
  const marketNotifs = notifications.filter(n => n.type === 'market' && !n.read).length;
  const choreNotifs = notifications.filter(n => (n.type === 'task' || n.type === 'rejection') && !n.read).length;

  // Wishlist Progress
  const wishlistId = currentUser?.wishlist[0] || 'm1'; 
  const goalItem = marketItems.find(i => i.id === wishlistId) || marketItems[0];
  const progress = Math.min((currentUser?.tokens || 0) / goalItem.cost, 1);

  const handleVerify = async (taskId: string) => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) {
      submitTask(taskId, result.assets[0].uri);
      clearNotifications('rejection');
      Alert.alert("Sent for Review!", "Mom or Dad will check it soon.");
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      
      {/* 1. THE TOKA BANK (Combined Wallet & Vault) */}
      <View style={styles.bankCard}>
        <View style={styles.bankHeader}>
          <Text style={styles.bankTitle}>🏦 Toka Bank</Text>
          <TouchableOpacity style={styles.historyBtnSmall} onPress={() => setShowHistory(true)}>
            <Text style={styles.historyBtnText}>History 📜</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bankMainRow}>
          <View style={styles.accountBox}>
            <Text style={styles.accountLabel}>SPENDABLE</Text>
            <Text style={styles.accountAmount}>💰 {currentUser?.tokens}</Text>
          </View>
          <View style={styles.bankDivider} />
          <View style={styles.accountBox}>
            <Text style={styles.accountLabel}>VAULT SAVINGS</Text>
            <Text style={styles.vaultAmountMain}>💎 {vaultBalance}</Text>
            <Text style={styles.interestTag}>+5% Growth</Text>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.bankInput}
            placeholder="Enter Amount"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="numeric"
            value={bankAmount}
            onChangeText={setBankAmount}
          />
        </View>

        <View style={styles.bankActionRow}>
          <TouchableOpacity 
            style={[styles.bankActionBtn, { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]} 
            onPress={() => {
              depositToVault(Number(bankAmount));
              setBankAmount('');
            }}
          >
            <Text style={styles.bankActionText}>Deposit 📥</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bankActionBtn} 
            onPress={() => {
              withdrawFromVault(Number(bankAmount));
              setBankAmount('');
            }}
          >
            <Text style={styles.bankActionText}>Withdraw 📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. CHORE BOARD (Tabbed System) */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Chore Board</Text>
          <Badge count={choreNotifs} />
        </View>

        <View style={styles.tabContainer}>
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                clearNotifications('task');
              }}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTasks.length === 0 && activeTab !== 'daily' && (
          <Text style={styles.emptyText}>No {activeTab} tasks for now. Rest up! ✨</Text>
        )}

        {filteredTasks.map(task => (
           <View key={task.id} style={[styles.taskCard, task.rejectionReason ? styles.rejectedBorder : null]}>
             <View style={styles.rowBetween}>
               <View>
                 <Text style={styles.taskTitle}>{task.title}</Text>
                 <Text style={styles.typeTag}>{task.type === 'spontaneous' ? '⚡ INSTANT' : task.frequency?.toUpperCase()}</Text>
               </View>
               <Text style={styles.taskReward}>💎 {task.reward}</Text>
             </View>
             {task.rejectionReason && (
               <View style={styles.rejectionBox}>
                 <Text style={styles.rejectionText}>💬 Fix: "{task.rejectionReason}"</Text>
               </View>
             )}
             <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify(task.id)}>
               <Text style={styles.btnText}>{task.status === 'pending' ? 'Reviewing...' : 'Verify 📸'}</Text>
             </TouchableOpacity>
           </View>
        ))}

        {activeTab === 'daily' && availablePool.map(task => (
          <View key={task.id} style={styles.poolCard}>
            <View style={{flex: 1}}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.poolTag}>⚡ AVAILABLE TO CLAIM</Text>
            </View>
            <TouchableOpacity style={styles.claimBtn} onPress={() => acceptTask(task.id, currentUser?.id || '')}>
              <Text style={styles.btnText}>Claim 💎</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 3. LEADERBOARD */}
      <View style={styles.leaderboardCard}>
        <Text style={styles.sectionTitleWhite}>🏆 Household Ranking</Text>
        {leaderboard.slice(0, 3).map((u, index) => (
          <View key={u.id} style={styles.leaderRow}>
            <Text style={styles.rankText}>{index + 1}. {u.name.split(' ')[0]} {u.id === currentUser?.id ? '(Me)' : ''}</Text>
            <Text style={styles.rankTokens}>{u.tokens} 💎</Text>
          </View>
        ))}
      </View>

      {/* 4. MARKETPLACE */}
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
        <View style={styles.wishlistProgressArea}>
            <Text style={styles.miniLabel}>WISH LIST GOAL: {goalItem.name}</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
        </View>
      </View>

      <Modal visible={showHistory} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Activity Ledger</Text>
          <ScrollView>
            {transactions.map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <Text style={tx.type === 'earn' ? styles.txEarn : styles.txSpend}>{tx.type === 'earn' ? '+' : '-'}{tx.amount}</Text>
                <Text style={styles.txReason}>{tx.reason}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHistory(false)}>
            <Text style={styles.btnText}>Return to App</Text>
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
  
  // Bank Styles
  bankCard: { backgroundColor: '#6C5CE7', margin: 15, borderRadius: 25, paddingVertical: 20, elevation: 8 },
  bankHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  bankTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  historyBtnSmall: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  historyBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  bankMainRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  accountBox: { alignItems: 'center', flex: 1 },
  accountLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '900', marginBottom: 5 },
  accountAmount: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  vaultAmountMain: { color: '#FDCB6E', fontSize: 24, fontWeight: '900' },
  interestTag: { backgroundColor: '#00B894', color: '#FFF', fontSize: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, marginTop: 5, fontWeight: 'bold' },
  bankDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
  inputWrapper: { paddingHorizontal: 40, marginBottom: 15 },
  bankInput: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#FFF', textAlign: 'center', fontSize: 18, fontWeight: 'bold', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  bankActionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: 10 },
  bankActionBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  bankActionText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // Tab Styles
  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F2F6', borderRadius: 12, padding: 4, marginBottom: 15, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 10, fontWeight: '800', color: '#B2BEC3' },
  activeTabText: { color: '#6C5CE7' },

  // Task Styles
  taskCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginBottom: 12 },
  taskTitle: { fontSize: 15, fontWeight: '700', color: '#2D3436' },
  typeTag: { fontSize: 9, fontWeight: '800', color: '#B2BEC3', marginTop: 2 },
  taskReward: { color: '#0984E3', fontWeight: 'bold', fontSize: 16 },
  verifyBtn: { backgroundColor: '#6C5CE7', padding: 12, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  rejectedBorder: { borderLeftWidth: 6, borderLeftColor: '#D63031', backgroundColor: '#FFF5F5' },
  rejectionBox: { backgroundColor: '#FFEAEA', padding: 10, borderRadius: 10, marginTop: 10 },
  rejectionText: { color: '#D63031', fontSize: 11, fontWeight: 'bold' },

  // Pool Styles
  poolCard: { backgroundColor: '#E1F5FE', padding: 15, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#03A9F4' },
  poolTag: { fontSize: 8, fontWeight: '900', color: '#03A9F4', marginTop: 2 },
  claimBtn: { backgroundColor: '#03A9F4', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },

  // Marketplace & Progress
  marketScroll: { marginTop: 10 },
  marketItemCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginRight: 15, width: 120, alignItems: 'center' },
  itemEmoji: { fontSize: 24 },
  itemName: { fontSize: 11, fontWeight: '700', textAlign: 'center', height: 30, marginVertical: 5 },
  itemCost: { color: '#00B894', fontWeight: 'bold', fontSize: 12 },
  buyBtn: { backgroundColor: '#FDCB6E', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 8 },
  buyBtnText: { fontWeight: 'bold', fontSize: 11 },
  disabledBtn: { opacity: 0.3 },
  wishlistLink: { fontSize: 8, color: '#6C5CE7', marginTop: 5, fontWeight: 'bold' },
  wishlistProgressArea: { marginTop: 20 },
  progressBg: { height: 8, backgroundColor: '#F1F2F6', borderRadius: 4, overflow: 'hidden', marginVertical: 5 },
  progressFill: { height: '100%', backgroundColor: '#00B894' },

  // Leaderboard
  leaderboardCard: { backgroundColor: '#FDCB6E', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15 },
  leaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rankText: { fontWeight: 'bold' },
  rankTokens: { fontWeight: 'bold', color: '#D35400' },

  // Shared
  badgeContainer: { backgroundColor: '#D63031', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#B2BEC3', marginVertical: 20, fontSize: 12 },
  miniLabel: { fontSize: 9, fontWeight: 'bold', color: '#B2BEC3', marginBottom: 4 },
  modalContainer: { flex: 1, padding: 30, backgroundColor: '#FFF' },
  modalTitle: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
  txRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  txEarn: { color: '#00B894', fontWeight: 'bold', width: 40 },
  txSpend: { color: '#D63031', fontWeight: 'bold', width: 40 },
  txReason: { flex: 1, color: '#2D3436', fontSize: 13 },
  closeBtn: { backgroundColor: '#2D3436', padding: 15, borderRadius: 15, marginTop: 20, alignItems: 'center' }
});