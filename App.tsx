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
    approveTask, 
    setRole, 
    joinHousehold, 
    generateInviteCode,
    submitTask 
  } = useTokaStore();

  // --- PHASE 2: SNAP-TO-VERIFY LOGIC ---
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
      // Logic: Mark task as 'pending' with the image URI
      submitTask(taskId, result.assets[0].uri);
      Alert.alert("Success", "Photo submitted for approval!");
    }
  };

  const handleJoinHouse = () => {
    const code = generateInviteCode();
    joinHousehold(code);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Toka Functional Prototype</Text>
        
        {/* --- HOUSEHOLD & ROLE --- */}
        <View style={styles.section}>
          <Text style={styles.label}>Household ID: {user.householdId || "Not Joined"}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.smallButton} onPress={handleJoinHouse}>
              <Text style={styles.buttonText}>Join House</Text>
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
        <View style={styles.section}>
          <Text style={styles.statText}>Tokens: 💰 {user.tokens}</Text>
          <Text style={styles.statText}>Streak: 🔥 {user.streak} days</Text>
        </View>

        {/* --- TASK LIST --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Chores</Text>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskReward}>💎 {task.reward} Tokens</Text>
                {task.assignedTo.length > 1 && <Text style={styles.teamTag}>👥 Team-Up</Text>}
              </View>

              {/* Status & Actions */}
              <View style={styles.actionRow}>
                <Text style={[styles.statusText, {color: getStatusColor(task.status)}]}>
                  {task.status.toUpperCase()}
                </Text>

                {/* Member View: Submit Photo */}
                {task.status === 'open' && (
                  <TouchableOpacity style={styles.verifyButton} onPress={() => handlePickImage(task.id)}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                )}

                {/* Admin View: Approve Task */}
                {task.status === 'pending' && user.role === 'admin' && (
                  <TouchableOpacity style={styles.approveButton} onPress={() => approveTask(task.id)}>
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {task.proofUrl && <Image source={{ uri: task.proofUrl }} style={styles.previewImage} />}
            </View>
          ))}
        </View>

        {/* --- TRANSACTION LEDGER --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>History</Text>
          {transactions.map(tx => (
            <Text key={tx.id} style={styles.ledgerText}>
              {tx.type === 'earn' ? '✅' : '🛒'} {tx.type === 'earn' ? '+' : '-'}{tx.amount} | {tx.reason}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'completed': return '#4CAF50';
    case 'pending': return '#FF9800';
    default: return '#2196F3';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingTop: 60 },
  scrollContent: { padding: 15 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1A1A1A' },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  label: { fontSize: 13, color: '#888', marginBottom: 8 },
  statText: { fontSize: 18, fontWeight: '700', marginVertical: 3, color: '#2C3E50' },
  smallButton: { backgroundColor: '#2196F3', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  taskCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  taskInfo: { marginBottom: 8 },
  taskTitle: { fontSize: 16, fontWeight: '600' },
  taskReward: { fontSize: 14, color: '#666' },
  teamTag: { fontSize: 11, color: '#9C27B0', fontWeight: 'bold', marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  verifyButton: { backgroundColor: '#673AB7', padding: 8, borderRadius: 5 },
  approveButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 5 },
  ledgerText: { fontSize: 13, color: '#555', marginTop: 6, borderLeftWidth: 3, borderLeftColor: '#DDD', paddingLeft: 8 },
  previewImage: { width: '100%', height: 100, borderRadius: 8, marginTop: 10 }
});