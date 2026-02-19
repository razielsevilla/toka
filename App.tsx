import React from 'react';
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
    approveTask, 
    setRole, 
    joinHousehold, 
    generateInviteCode,
    submitTask,
    purchaseItem,
    openMysteryBox
  } = useTokaStore();

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

  // Helper for Status Colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      default: return '#2196F3';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Toka Economy Prototype</Text>
        
        {/* --- HOUSEHOLD & ROLE --- */}
        <View style={styles.section}>
          <Text style={styles.label}>Household ID: {user.householdId || "Not Joined"}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.smallButton} onPress={handleJoinHouse}>
              <Text style={styles.buttonText}>Invite & Join</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.smallButton, {backgroundColor: user.role === 'admin' ? '#FF5722' : '#9E9E9E'}]} 
              onPress={() => setRole(user.role === 'admin' ? 'member' : 'admin')}
            >
              <Text style={styles.buttonText}>Role: {user.role.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- USER STATS --- */}
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

        {/* --- THE MARKET (Phase 3) --- */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.subTitle}>🛒 Toka Market</Text>
            {user.streak >= 7 && <Text style={styles.discountTag}>10% STREAK DISCOUNT ACTIVE!</Text>}
          </View>
          
          {marketItems.map(item => {
            const discount = user.streak >= 7 ? 0.9 : 1.0;
            const price = Math.floor(item.cost * discount);
            
            return (
              <View key={item.id} style={styles.marketItem}>
                <View>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.itemType}>{item.type}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyButton, { opacity: user.tokens < price ? 0.5 : 1 }]} 
                  onPress={() => {
                    if (purchaseItem(item.id)) Alert.alert("Success!", `Bought ${item.name}`);
                    else Alert.alert("Oops", "Not enough tokens!");
                  }}
                >
                  <Text style={styles.buttonText}>💰 {price}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity 
            style={styles.gachaButton}
            onPress={() => {
              const result = openMysteryBox();
              Alert.alert("🎁 Mystery Box", result);
            }}
          >
            <Text style={styles.gachaText}>🎁 OPEN MYSTERY BOX (40 TOKENS)</Text>
            <Text style={styles.gachaSubText}>Win big rewards or bonus tokens!</Text>
          </TouchableOpacity>
        </View>

        {/* --- CHORE LIST --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>🧹 Available Chores</Text>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskReward}>💎 {task.reward} Tokens</Text>
                {task.assignedTo.length > 1 && <Text style={styles.teamTag}>👥 Team-Up Splitting</Text>}
              </View>

              <View style={styles.actionRow}>
                <Text style={[styles.statusText, {color: getStatusColor(task.status)}]}>
                  {task.status.toUpperCase()}
                </Text>

                {task.status === 'open' && (
                  <TouchableOpacity style={styles.verifyButton} onPress={() => handlePickImage(task.id)}>
                    <Text style={styles.buttonText}>Submit Proof</Text>
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
          <Text style={styles.subTitle}>📜 Ledger</Text>
          {transactions.map(tx => (
            <View key={tx.id} style={styles.ledgerRow}>
              <Text style={styles.ledgerEmoji}>{tx.type === 'earn' ? '✅' : '🛒'}</Text>
              <Text style={styles.ledgerText}>
                {tx.type === 'earn' ? '+' : '-'}{tx.amount} | {tx.reason}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD', paddingTop: 60 },
  scrollContent: { padding: 15 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#2D3436' },
  section: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 15, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statCard: { flex: 0.48, padding: 15, borderRadius: 15, alignItems: 'center', elevation: 2 },
  statEmoji: { fontSize: 24, marginBottom: 5 },
  statVal: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  statLabel: { fontSize: 12, color: '#636E72', fontWeight: '600' },

  // Market
  subTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2D3436' },
  discountTag: { fontSize: 10, backgroundColor: '#4CAF50', color: 'white', padding: 4, borderRadius: 4, fontWeight: 'bold' },
  marketItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  itemText: { fontSize: 16, fontWeight: '600', color: '#2D3436' },
  itemType: { fontSize: 12, color: '#B2BEC3' },
  buyButton: { backgroundColor: '#FDCB6E', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },

  // Gacha
  gachaButton: { backgroundColor: '#D63031', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 15, shadowColor: '#D63031', shadowOpacity: 0.3, shadowRadius: 10 },
  gachaText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  gachaSubText: { color: '#FF7675', fontSize: 10, marginTop: 4, fontWeight: 'bold' },

  // Chores
  taskCard: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  taskInfo: { marginBottom: 10 },
  taskTitle: { fontSize: 17, fontWeight: '700', color: '#2D3436' },
  taskReward: { fontSize: 14, color: '#636E72', marginTop: 2 },
  teamTag: { fontSize: 11, color: '#6C5CE7', fontWeight: 'bold', marginTop: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { fontSize: 11, fontWeight: '900' },
  verifyButton: { backgroundColor: '#6C5CE7', padding: 10, borderRadius: 8 },
  approveButton: { backgroundColor: '#00B894', padding: 10, borderRadius: 8 },
  previewImage: { width: '100%', height: 120, borderRadius: 10, marginTop: 12 },

  // Shared
  smallButton: { backgroundColor: '#0984E3', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  label: { fontSize: 12, color: '#B2BEC3', marginBottom: 10 },
  ledgerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ledgerEmoji: { fontSize: 16, marginRight: 10 },
  ledgerText: { fontSize: 13, color: '#636E72', fontWeight: '500' }
});