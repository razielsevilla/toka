import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from './src/store/useTokaStore';

export default function App() {
  const { 
    user, 
    tasks, 
    transactions, 
    marketItems,
    auction,
    vaultBalance,
    approveTask, 
    setRole, 
    joinHousehold, 
    generateInviteCode,
    submitTask,
    purchaseItem,
    openMysteryBox,
    tickAuction,
    placeBid,
    resetStreak
  } = useTokaStore();

  // --- PHASE 5: AUCTION TIMER TICK ---
  useEffect(() => {
    const interval = setInterval(() => {
      tickAuction();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickAuction]);

  // --- PHASE 2: SNAP-TO-VERIFY ---
  const handlePickImage = async (taskId: string) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Toka needs camera access to verify chores!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      submitTask(taskId, result.assets[0].uri);
      Alert.alert("Success", "Photo submitted! Wait for Admin approval.");
    }
  };

  const handleJoinHouse = () => {
    const code = generateInviteCode();
    joinHousehold(code);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#00B894';
      case 'pending': return '#F39C12';
      default: return '#0984E3';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Toka: Family Economy</Text>
        
        {/* --- HOUSEHOLD & ROLE --- */}
        <View style={styles.section}>
          <Text style={styles.label}>Household: {user.householdId || "Not Joined"}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.smallButton} onPress={handleJoinHouse}>
              <Text style={styles.buttonText}>Invite Code</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.smallButton, {backgroundColor: user.role === 'admin' ? '#D63031' : '#636E72'}]} 
              onPress={() => setRole(user.role === 'admin' ? 'member' : 'admin')}
            >
              <Text style={styles.buttonText}>Mode: {user.role.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- USER STATS & PHASE 4 MULTIPLIERS --- */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, {backgroundColor: '#E3F2FD'}]}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statVal}>{user.tokens}</Text>
            <Text style={styles.statLabel}>Tokens</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: '#FFF3E0'}]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statVal}>{user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.multiplierBar}>
          <Text style={styles.multiplierText}>
            Current Power: <Text style={styles.boldText}>
              {user.streak >= 30 ? '2.0x' : user.streak >= 14 ? '1.5x' : user.streak >= 7 ? '1.2x' : '1.0x'}
            </Text>
          </Text>
          <TouchableOpacity onPress={() => resetStreak()}>
            <Text style={styles.resetText}>Simulate Missed Day</Text>
          </TouchableOpacity>
        </View>

        {/* --- PHASE 6: THE TOKA VAULT --- */}
        <View style={[styles.section, {backgroundColor: '#6C5CE7'}]}>
          <View style={styles.row}>
            <Text style={[styles.subTitle, {color: '#FFF'}]}>🏦 The Toka Vault</Text>
            <TouchableOpacity onPress={() => useTokaStore.getState().applyInterest()}>
              <Text style={{color: '#A29BFE', fontSize: 10, fontWeight: 'bold'}}>SIMULATE INTEREST</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.vaultDisplay}>
            <Text style={styles.vaultLabel}>Stored Balance</Text>
            <Text style={styles.vaultAmount}>💎 {vaultBalance || 0}</Text>
            <Text style={styles.vaultSub}>Earning 5% Compound Interest</Text>
          </View>

          <View style={styles.bidActionRow}>
            <TouchableOpacity 
              style={[styles.bidButton, {backgroundColor: '#A29BFE'}]} 
              onPress={() => useTokaStore.getState().depositToVault(50)}
            >
              <Text style={styles.buttonText}>Deposit 50</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bidButton, {backgroundColor: '#4834D4'}]} 
              onPress={() => useTokaStore.getState().withdrawFromVault(50)}
            >
              <Text style={styles.buttonText}>Withdraw 50</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PHASE 5: MONTHLY AUCTION --- */}
        <View style={[styles.section, {backgroundColor: '#2D3436'}]}>
          <View style={styles.row}>
            <Text style={[styles.subTitle, {color: '#FFF'}]}>🔨 Live Auction</Text>
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>
                {Math.floor(auction.timeLeft / 60)}:{(auction.timeLeft % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          </View>
          <Text style={styles.auctionItem}>{auction.itemName}</Text>
          <View style={styles.bidInfo}>
            <Text style={styles.bidLabel}>High Bid: <Text style={styles.bidVal}>💰 {auction.highestBid}</Text></Text>
            <Text style={styles.bidLabel}>Leader: <Text style={styles.bidVal}>{auction.highestBidder || 'None'}</Text></Text>
          </View>
          <View style={styles.bidActionRow}>
            <TouchableOpacity style={styles.bidButton} onPress={() => placeBid(auction.highestBid + 10)}>
              <Text style={styles.buttonText}>+10 Tokens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bidButton, {backgroundColor: '#E17055'}]} onPress={() => placeBid(auction.highestBid + 50)}>
              <Text style={styles.buttonText}>+50 Tokens</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PHASE 3: THE MARKET --- */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.subTitle}>🛒 Toka Market</Text>
            {user.streak >= 7 && <Text style={styles.discountTag}>STREAK DISCOUNT ACTIVE!</Text>}
          </View>
          {marketItems.map(item => {
            const price = user.streak >= 7 ? Math.floor(item.cost * 0.9) : item.cost;
            return (
              <View key={item.id} style={styles.marketItem}>
                <View>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.itemType}>{item.type}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyButton, { opacity: user.tokens < price ? 0.5 : 1 }]} 
                  onPress={() => purchaseItem(item.id)}
                >
                  <Text style={styles.buttonText}>💰 {price}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity style={styles.gachaButton} onPress={() => {
            const res = openMysteryBox();
            Alert.alert("Mystery Box", res);
          }}>
            <Text style={styles.gachaText}>🎁 OPEN MYSTERY BOX (40 TOKENS)</Text>
          </TouchableOpacity>
        </View>

        {/* --- PHASE 2: CHORE LIST --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>🧹 Active Chores</Text>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskReward}>💎 {task.reward} Tokens</Text>
                {task.assignedTo.length > 1 && <Text style={styles.teamTag}>👥 Team-Up (Split Reward)</Text>}
              </View>
              <View style={styles.actionRow}>
                <Text style={[styles.statusText, {color: getStatusColor(task.status)}]}>
                  {task.status.toUpperCase()}
                </Text>
                {task.status === 'open' && (
                  <TouchableOpacity style={styles.verifyButton} onPress={() => handlePickImage(task.id)}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                )}
                {task.status === 'pending' && user.role === 'admin' && (
                  <TouchableOpacity style={styles.approveButton} onPress={() => approveTask(task.id)}>
                    <Text style={styles.buttonText}>Admin Approve</Text>
                  </TouchableOpacity>
                )}
              </View>
              {task.proofUrl && <Image source={{ uri: task.proofUrl }} style={styles.previewImage} />}
            </View>
          ))}
        </View>

        {/* --- TRANSACTION HISTORY --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>📜 History</Text>
          {transactions.slice(0, 5).map(tx => (
            <Text key={tx.id} style={styles.ledgerText}>
              {tx.type === 'earn' ? '✅' : '🛒'} {tx.amount} | {tx.reason}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingTop: 60 },
  scrollContent: { padding: 15 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 20, color: '#2D3436' },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
  label: { fontSize: 12, color: '#636E72', marginBottom: 5 },
  
  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCard: { flex: 0.48, padding: 15, borderRadius: 15, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#636E72' },
  statEmoji: { fontSize: 20 },
  
  // Multiplier
  multiplierBar: { backgroundColor: '#DFE6E9', padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  multiplierText: { fontSize: 12, fontWeight: '600' },
  boldText: { color: '#6C5CE7', fontWeight: '800' },
  resetText: { fontSize: 10, color: '#D63031', textDecorationLine: 'underline' },

  // Auction
  timerBadge: { backgroundColor: '#D63031', padding: 4, borderRadius: 4 },
  timerText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, fontFamily: 'monospace' },
  auctionItem: { color: '#FDCB6E', fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  bidInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  bidLabel: { color: '#B2BEC3', fontSize: 12 },
  bidVal: { color: '#FFF', fontWeight: 'bold' },
  bidActionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bidButton: { backgroundColor: '#0984E3', padding: 10, borderRadius: 8, flex: 0.48, alignItems: 'center' },

  // Market
  marketItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  itemText: { fontSize: 15, fontWeight: '600' },
  itemType: { fontSize: 10, color: '#B2BEC3' },
  buyButton: { backgroundColor: '#FDCB6E', padding: 8, borderRadius: 6 },
  discountTag: { backgroundColor: '#00B894', color: '#FFF', fontSize: 8, padding: 3, borderRadius: 4, fontWeight: 'bold' },
  gachaButton: { backgroundColor: '#D63031', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  gachaText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // Task
  taskCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  taskInfo: { marginBottom: 8 },
  taskTitle: { fontSize: 16, fontWeight: '700' },
  taskReward: { fontSize: 14, color: '#636E72', marginTop: 2 },
  teamTag: { fontSize: 10, color: '#6C5CE7', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  verifyButton: { backgroundColor: '#6C5CE7', padding: 8, borderRadius: 6 },
  approveButton: { backgroundColor: '#00B894', padding: 8, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  previewImage: { width: '100%', height: 100, borderRadius: 10, marginTop: 10 },

  // Shared
  smallButton: { backgroundColor: '#0984E3', padding: 8, borderRadius: 6 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  ledgerText: { fontSize: 12, color: '#636E72', marginVertical: 2 },

  // Vault
  vaultDisplay: { 
    alignItems: 'center', 
    marginVertical: 15, 
    padding: 15, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 12 
  },
  vaultLabel: { color: '#DCDDE1', fontSize: 12, fontWeight: '600' },
  vaultAmount: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  vaultSub: { color: '#A29BFE', fontSize: 10, marginTop: 5, fontWeight: 'bold' }
});