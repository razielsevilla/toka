import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from '../../store/useTokaStore';

export default function ChoreBoard() {
  const { currentUser, tasks, acceptTask, submitTask, clearNotifications, notifications, submitCounterOffer } = useTokaStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const [negotiatingTaskId, setNegotiatingTaskId] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterReason, setCounterReason] = useState('');

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

  const handleSendOffer = (taskId: string) => {
    if (!counterAmount || !counterReason) {
      Alert.alert("Missing Info", "Please provide how many tokens you want, and why!");
      return;
    }
    const amountNum = parseInt(counterAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Tokens must be a positive number.");
      return;
    }

    submitCounterOffer(taskId, currentUser?.id || '', amountNum, counterReason);
    setNegotiatingTaskId(null);
    setCounterAmount('');
    setCounterReason('');
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
          {negotiatingTaskId === task.id ? (
            <View style={styles.negotiateForm}>
              <Text style={styles.formLabel}>Negotiating: {task.title} (Current: {task.reward}💎)</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
                <TextInput style={[styles.input, { flex: 0.3 }]} placeholder="Amount" keyboardType="numeric" value={counterAmount} onChangeText={setCounterAmount} />
                <TextInput style={[styles.input, { flex: 0.7 }]} placeholder="Reason? (e.g. Too hard)" value={counterReason} onChangeText={setCounterReason} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setNegotiatingTaskId(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitOfferBtn} onPress={() => handleSendOffer(task.id)}>
                  <Text style={styles.btnText}>Send Offer ✨</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskReward}>💎 {task.reward}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.negotiateBtn} onPress={() => setNegotiatingTaskId(task.id)}>
                  <Text style={styles.negotiateBtnText}>Negotiate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.claimBtn} onPress={() => acceptTask(task.id, currentUser?.id || '')}>
                  <Text style={styles.btnText}>Claim</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  claimBtn: { backgroundColor: '#03A9F4', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  badge: { backgroundColor: '#D63031', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
  negotiateBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#03A9F4', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  negotiateBtnText: { color: '#03A9F4', fontWeight: 'bold', fontSize: 12 },
  negotiateForm: { width: '100%' },
  formLabel: { fontSize: 13, fontWeight: '700', color: '#2D3436' },
  input: { backgroundColor: '#FFF', borderRadius: 8, padding: 10, fontSize: 13, color: '#2D3436', borderWidth: 1, borderColor: '#B2BEC3' },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 15 },
  cancelBtnText: { color: '#B2BEC3', fontWeight: '700', fontSize: 12 },
  submitOfferBtn: { backgroundColor: '#6C5CE7', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
});