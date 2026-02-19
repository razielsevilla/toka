import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function ParentDashboard() {
  const { tasks, approveTask, generateInviteCode, mockUsers } = useTokaStore();
  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <ScrollView style={styles.container}>
      {/* 1. HOUSEHOLD MANAGEMENT */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Manage Household</Text>
        <Text style={styles.label}>Members: {mockUsers.length}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Invite Code", generateInviteCode())}>
          <Text style={styles.buttonText}>+ Add Member / Admin</Text>
        </TouchableOpacity>
      </View>

      {/* 2. TASK CREATION */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Create New Task</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Task Title (e.g. Wash Car)" 
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Reward (Tokens)" 
          keyboardType="numeric"
          value={reward}
          onChangeText={setReward}
        />
        <View style={styles.row}>
          <TouchableOpacity style={styles.typeButton}><Text>📅 Regular</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.typeButton, {backgroundColor: '#6C5CE7'}]}><Text style={{color:'#FFF'}}>⚡ Spontaneous</Text></TouchableOpacity>
        </View>
      </View>

      {/* 3. VERIFICATION QUEUE */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Verification Queue ({pendingTasks.length})</Text>
        {pendingTasks.map(task => (
          <View key={task.id} style={styles.verifyCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <TouchableOpacity style={styles.approveButton} onPress={() => approveTask(task.id)}>
              <Text style={styles.buttonText}>Verify & Release Tokens</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 12, color: '#636E72', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#DDD', marginBottom: 15, padding: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { backgroundColor: '#0984E3', padding: 10, borderRadius: 8, alignItems: 'center' },
  typeButton: { flex: 0.48, padding: 10, borderRadius: 8, backgroundColor: '#F1F2F6', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  verifyCard: { padding: 10, backgroundColor: '#F9F9F9', borderRadius: 10, marginTop: 10 },
  taskTitle: { fontWeight: 'bold', marginBottom: 5 },
  approveButton: { backgroundColor: '#00B894', padding: 8, borderRadius: 5, alignItems: 'center' }
});