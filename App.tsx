import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTokaStore } from './src/store/useTokaStore';

export default function App() {
  // Pulling data and actions from our "Brain"
  const { user, tasks, transactions, approveTask, setRole, joinHousehold, generateInviteCode } = useTokaStore();

  const handleTestApproval = () => {
    // 1. Switch to Admin to allow approval
    setRole('admin');
    // 2. Approve the first task (Wash the Dishes)
    approveTask('1');
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
        
        {/* --- HOUSEHOLD SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.label}>Household ID: {user.householdId || "Not Joined"}</Text>
          <TouchableOpacity style={styles.button} onPress={handleJoinHouse}>
            <Text style={styles.buttonText}>Simulate Invite & Join</Text>
          </TouchableOpacity>
        </View>

        {/* --- USER STATS --- */}
        <View style={styles.section}>
          <Text style={styles.statText}>Role: {user.role.toUpperCase()}</Text>
          <Text style={styles.statText}>Tokens: 💰 {user.tokens}</Text>
          <Text style={styles.statText}>Streak: 🔥 {user.streak} days</Text>
        </View>

        {/* --- TASK LOGIC TEST --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Active Tasks</Text>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <Text>{task.title} ({task.reward} Tokens)</Text>
              <Text style={{color: task.status === 'completed' ? 'green' : 'orange'}}>
                Status: {task.status}
              </Text>
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.button, {backgroundColor: '#4CAF50'}]} 
            onPress={handleTestApproval}
          >
            <Text style={styles.buttonText}>Admin: Approve "Wash Dishes"</Text>
          </TouchableOpacity>
        </View>

        {/* --- TRANSACTION LEDGER --- */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Transaction History</Text>
          {transactions.map(tx => (
            <Text key={tx.id} style={styles.ledgerText}>
              {tx.type === 'earn' ? '+' : '-'}{tx.amount} | {tx.reason}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 60 },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 14, color: '#666', marginBottom: 10 },
  statText: { fontSize: 16, fontWeight: '600', marginVertical: 2 },
  button: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  taskCard: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  ledgerText: { fontSize: 12, fontStyle: 'italic', color: '#444', marginTop: 5 }
});