import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function ParentDashboard() {
  // 1. Added rejectTask to the destructured store hook
  const { tasks, approveTask, rejectTask, generateInviteCode, mockUsers } = useTokaStore();
  
  // Local state for Task Creation
  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'spontaneous'>('regular');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const householdMembers = mockUsers.filter(u => u.role === 'member');

  const handleCreateTask = () => {
    if (!taskTitle || !reward) {
      Alert.alert("Missing Info", "Please give the task a title and a reward amount.");
      return;
    }
    // Logic: In a real app, this would call addTask() in the store
    Alert.alert("Success", `${taskType} task "${taskTitle}" created!`);
    setTaskTitle('');
    setReward('');
  };

    // 2. Added handleReject function
    const handleReject = (taskId: string) => {
        Alert.prompt(
        "Send Back Chore",
        "What needs to be fixed?",
        [
            { text: "Cancel", style: "cancel" },
            { 
            text: "Send Back", 
            onPress: (reason?: string) => rejectTask(taskId, reason || "Needs more work!") 
            }
        ]
        );
    };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* 1. HOUSEHOLD OVERVIEW CARD */}
      <View style={styles.overviewCard}>
        <Text style={styles.sectionTitle}>Household Overview</Text>
        <View style={styles.row}>
          {householdMembers.map(child => (
            <View key={child.id} style={styles.childPill}>
              <Text style={styles.childEmoji}>🧒</Text>
              <Text style={styles.childName}>{child.name.split(' ')[0]}</Text>
              <Text style={styles.childTokens}>💰 {child.tokens}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addMemberBtn} onPress={() => Alert.alert("Invite Code", generateInviteCode())}>
            <Text style={styles.addMemberPlus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. VERIFICATION QUEUE */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Verification Queue</Text>
          <View style={styles.countBadge}><Text style={styles.countText}>{pendingTasks.length}</Text></View>
        </View>
        
        {pendingTasks.length === 0 ? (
          <Text style={styles.emptyText}>All chores are up to date! ✨</Text>
        ) : (
          pendingTasks.map(task => (
            <View key={task.id} style={styles.verifyCard}>
              <View style={styles.verifyInfo}>
                <Text style={styles.verifyTaskName}>{task.title}</Text>
                <Text style={styles.verifySubtitle}>Submitted by: {task.assignedTo[0] || 'Child'}</Text>
              </View>
              {task.proofUrl && (
                <Image source={{ uri: task.proofUrl }} style={styles.proofPreview} />
              )}
              
              {/* 3. Updated Action Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.rejectBtn} 
                  onPress={() => handleReject(task.id)}
                >
                  <Text style={styles.rejectBtnText}>Send Back ❌</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.approveBtn} 
                  onPress={() => approveTask(task.id)}
                >
                  <Text style={styles.approveBtnText}>Approve 💎 {task.reward}</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))
        )}
      </View>

      {/* 3. TASK CREATOR */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assign New Chore</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Clean the Playroom" 
          placeholderTextColor="#999"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <View style={styles.rowBetween}>
          <View style={{flex: 0.45}}>
             <Text style={styles.miniLabel}>Reward Amount</Text>
             <TextInput 
                style={styles.input} 
                placeholder="Tokens" 
                keyboardType="numeric"
                value={reward}
                onChangeText={setReward}
              />
          </View>
          <View style={{flex: 0.45}}>
             <Text style={styles.miniLabel}>Task Type</Text>
             <View style={styles.typeToggle}>
                <TouchableOpacity 
                  onPress={() => setTaskType('regular')}
                  style={[styles.typeBtn, taskType === 'regular' && styles.typeBtnActive]}
                >
                  <Text style={[styles.typeBtnText, taskType === 'regular' && styles.typeBtnTextActive]}>Regular</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setTaskType('spontaneous')}
                  style={[styles.typeBtn, taskType === 'spontaneous' && styles.typeBtnActive]}
                >
                  <Text style={[styles.typeBtnText, taskType === 'spontaneous' && styles.typeBtnTextActive]}>Instant</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>

        {taskType === 'regular' && (
          <View style={styles.frequencyRow}>
            {['Daily', 'Weekly', 'Monthly'].map(f => (
              <TouchableOpacity 
                key={f} 
                onPress={() => setFrequency(f as any)}
                style={[styles.freqBtn, frequency === f && styles.freqBtnActive]}
              >
                <Text style={[styles.freqBtnText, frequency === f && styles.freqBtnTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.submitTaskBtn} onPress={handleCreateTask}>
          <Text style={styles.submitTaskBtnText}>Launch Chore 🚀</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Overview
  overviewCard: { backgroundColor: '#6C5CE7', padding: 20, borderRadius: 20, margin: 15, elevation: 4 },
  childPill: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12, marginRight: 10, alignItems: 'center', minWidth: 80 },
  childEmoji: { fontSize: 20 },
  childName: { color: 'white', fontWeight: 'bold', fontSize: 12, marginTop: 4 },
  childTokens: { color: '#FDCB6E', fontSize: 10, fontWeight: '800' },
  addMemberBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  addMemberPlus: { color: 'white', fontSize: 24, fontWeight: 'bold' },

  // Verification
  countBadge: { backgroundColor: '#D63031', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#B2BEC3', fontStyle: 'italic', marginVertical: 20 },
  verifyCard: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#F39C12' },
  verifyTaskName: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  verifySubtitle: { fontSize: 12, color: '#636E72', marginBottom: 10 },
  verifyInfo: { marginBottom: 10 },
  proofPreview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  
  // --- NEW STYLES ---
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rejectBtn: {
    flex: 0.35,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D63031',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: '#D63031',
    fontWeight: 'bold',
    fontSize: 12,
  },
  approveBtn: {
    flex: 0.6, // Approve button is bigger/primary
    backgroundColor: '#00B894',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtnText: { color: 'white', fontWeight: 'bold' },

  // Creator
  input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 14, color: '#2D3436', marginBottom: 15 },
  miniLabel: { fontSize: 11, fontWeight: 'bold', color: '#B2BEC3', marginBottom: 5, textTransform: 'uppercase' },
  typeToggle: { flexDirection: 'row', backgroundColor: '#F1F2F6', borderRadius: 10, padding: 4 },
  typeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  typeBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  typeBtnText: { fontSize: 12, fontWeight: '600', color: '#B2BEC3' },
  typeBtnTextActive: { color: '#6C5CE7' },
  frequencyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 5 },
  freqBtn: { flex: 0.3, paddingVertical: 8, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#DDD' },
  freqBtnActive: { borderColor: '#6C5CE7', backgroundColor: '#F4F1FF' },
  freqBtnText: { fontSize: 12, color: '#999' },
  freqBtnTextActive: { color: '#6C5CE7', fontWeight: 'bold' },
  submitTaskBtn: { backgroundColor: '#6C5CE7', padding: 16, borderRadius: 15, alignItems: 'center', elevation: 3 },
  submitTaskBtnText: { color: 'white', fontWeight: '800', fontSize: 16 }
});