import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from '../../store/useTokaStore';

export default function ChoreBoard() {
  const { currentUser, tasks, acceptTask, submitTask, clearNotifications, notifications } = useTokaStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const choreNotifs = notifications.filter(n => (n.type === 'task' || n.type === 'rejection') && !n.read).length;
  const myTasks = tasks.filter(t => t.assignedTo.includes(currentUser?.id || '') && t.status !== 'completed');
  const availablePool = tasks.filter(t => t.type === 'spontaneous' && t.status === 'open' && t.assignedTo.length === 0);

  const filteredTasks = myTasks
    .filter(t => activeTab === 'daily' ? (t.frequency === 'daily' || t.type === 'spontaneous') : t.frequency === activeTab)
    .sort((a) => a.rejectionReason ? -1 : 1);

  const handleVerify = async (taskId: string) => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) {
      submitTask(taskId, result.assets[0].uri);
      clearNotifications('rejection');
      Alert.alert("Sent for Review!", "Mom or Dad will check it soon.");
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Chore Board</Text>
        {choreNotifs > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{choreNotifs}</Text></View>}
      </View>

      <View style={styles.tabContainer}>
        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
          <TouchableOpacity 
            key={tab}
            onPress={() => { setActiveTab(tab); clearNotifications('task'); }}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTasks.map(task => (
        <View key={task.id} style={[styles.taskCard, task.rejectionReason && styles.rejectedCard]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.typeTag}>{task.type === 'spontaneous' ? '⚡ INSTANT' : task.frequency?.toUpperCase()}</Text>
            </View>
            <Text style={styles.taskReward}>💎 {task.reward}</Text>
          </View>
          {task.rejectionReason && <View style={styles.rejectionBox}><Text style={styles.rejectionText}>💬 Fix: "{task.rejectionReason}"</Text></View>}
          <TouchableOpacity 
            style={[styles.verifyBtn, task.status === 'pending' && styles.disabledBtn]} 
            onPress={() => handleVerify(task.id)}
            disabled={task.status === 'pending'}
          >
            <Text style={styles.btnText}>{task.status === 'pending' ? 'Reviewing...' : 'Verify 📸'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {activeTab === 'daily' && availablePool.map(task => (
        <View key={task.id} style={styles.poolCard}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <TouchableOpacity style={styles.claimBtn} onPress={() => acceptTask(task.id, currentUser?.id || '')}>
            <Text style={styles.btnText}>Claim 💎</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F2F6', borderRadius: 12, padding: 4, marginBottom: 15, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 10, fontWeight: '800', color: '#B2BEC3' },
  activeTabText: { color: '#6C5CE7' },
  taskCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginBottom: 12 },
  taskTitle: { fontSize: 15, fontWeight: '700', color: '#2D3436' },
  taskReward: { color: '#0984E3', fontWeight: 'bold', fontSize: 16 },
  typeTag: { fontSize: 9, fontWeight: '800', color: '#B2BEC3', marginTop: 2 },
  verifyBtn: { backgroundColor: '#6C5CE7', padding: 12, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#B2BEC3' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  rejectionBox: { backgroundColor: '#FFEAEA', padding: 10, borderRadius: 10, marginTop: 10 },
  rejectionText: { color: '#D63031', fontSize: 11, fontWeight: 'bold' },
  rejectedCard: { borderLeftWidth: 6, borderLeftColor: '#D63031' },
  poolCard: { backgroundColor: '#E1F5FE', padding: 15, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#03A9F4' },
  claimBtn: { backgroundColor: '#03A9F4', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  badge: { backgroundColor: '#D63031', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
});