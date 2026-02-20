import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function TaskCreator() {
  const { addTask } = useTokaStore();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'spontaneous'>('regular');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const handleCreateTask = () => {
    if (!taskTitle || !reward) {
      Alert.alert("Missing Info", "Please give the task a title and a reward amount.");
      return;
    }

    addTask({
      title: taskTitle,
      reward: parseInt(reward),
      type: taskType,
      frequency: taskType === 'regular' ? frequency.toLowerCase() as any : undefined,
      status: 'open',
      assignedTo: taskType === 'regular' ? ['u_child'] : [], 
    });

    Alert.alert("Success", `${taskType} task "${taskTitle}" is live!`);
    setTaskTitle('');
    setReward('');
  };

  return (
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
           <Text style={styles.miniLabel}>Reward</Text>
           <TextInput style={styles.input} placeholder="Tokens" keyboardType="numeric" value={reward} onChangeText={setReward} />
        </View>
        <View style={{flex: 0.45}}>
           <Text style={styles.miniLabel}>Type</Text>
           <View style={styles.typeToggle}>
              <TouchableOpacity onPress={() => setTaskType('regular')} style={[styles.typeBtn, taskType === 'regular' && styles.typeBtnActive]}>
                <Text style={[styles.typeBtnText, taskType === 'regular' && styles.typeBtnTextActive]}>Regular</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTaskType('spontaneous')} style={[styles.typeBtn, taskType === 'spontaneous' && styles.typeBtnActive]}>
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
  );
}

// Just copy the relevant styles from ParentDashboard here
const styles = StyleSheet.create({
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 14, color: '#2D3436', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniLabel: { fontSize: 10, fontWeight: 'bold', color: '#B2BEC3', marginBottom: 5 },
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
  submitTaskBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },
});