import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { Colors, Typography } from '../../theme/colors';

function getRemainingTime(deadline?: number) {
  if (!deadline) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export default function ChoreBoard() {
  const { currentUser, tasks, acceptTask, submitTask, clearNotifications, notifications, submitCounterOffer } = useTokaStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const [negotiatingTaskId, setNegotiatingTaskId] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterReason, setCounterReason] = useState('');

  const choreNotifs = notifications.filter(n => (n.type === 'task' || n.type === 'rejection') && !n.read).length;

  const now = Date.now();
  const myTasks = tasks.filter(t => t.assignedTo.includes(currentUser?.id || '') && t.status !== 'completed' && (!t.deadline || t.deadline > now));
  const availablePool = tasks.filter(t => t.type === 'spontaneous' && t.status === 'open' && t.assignedTo.length === 0 && (!t.deadline || t.deadline > now));

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
              <View style={styles.tagsRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  {task.type === 'spontaneous' && <Ionicons name="flash" size={10} color="#B2BEC3" />}
                  <Text style={styles.typeTag}>{task.type === 'spontaneous' ? 'INSTANT' : task.frequency?.toUpperCase()}</Text>
                </View>
                {task.deadline && (
                  <View style={[styles.deadlineTag, { flexDirection: 'row', alignItems: 'center', gap: 2 }]}>
                    <Ionicons name="hourglass" size={10} color="#E17055" />
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#E17055' }}>{getRemainingTime(task.deadline)} left</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="diamond" size={14} color="#0984E3" />
              <Text style={styles.taskReward}>{task.reward}</Text>
            </View>
          </View>
          {task.rejectionReason && (
            <View style={styles.rejectionBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="chatbubble-ellipses" size={12} color="#D63031" />
                <Text style={styles.rejectionText}>Fix: "{task.rejectionReason}"</Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[styles.verifyBtn, task.status === 'pending' && styles.disabledBtn]}
            onPress={() => handleVerify(task.id)}
            disabled={task.status === 'pending'}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Text style={styles.btnText}>{task.status === 'pending' ? 'Reviewing...' : 'Verify'}</Text>
              {task.status !== 'pending' && <Ionicons name="camera" size={14} color="white" />}
            </View>
          </TouchableOpacity>
        </View>
      ))}

      {activeTab === 'daily' && availablePool.map(task => (
        <View key={task.id} style={styles.poolCard}>
          {negotiatingTaskId === task.id ? (
            <View style={styles.negotiateForm}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.formLabel}>Negotiating: {task.title} (Current: {task.reward}</Text>
                <Ionicons name="diamond" size={12} color="#2D3436" />
                <Text style={styles.formLabel}>)</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
                <TextInput style={[styles.input, { flex: 0.3 }]} placeholder="Amount" keyboardType="numeric" value={counterAmount} onChangeText={setCounterAmount} />
                <TextInput style={[styles.input, { flex: 0.7 }]} placeholder="Reason? (e.g. Too hard)" value={counterReason} onChangeText={setCounterReason} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setNegotiatingTaskId(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitOfferBtn} onPress={() => handleSendOffer(task.id)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Text style={styles.btnText}>Send Offer</Text>
                    <Ionicons name="sparkles" size={12} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.tagsRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="diamond" size={14} color="#0984E3" />
                    <Text style={styles.taskReward}>{task.reward}</Text>
                  </View>
                  {task.deadline && (
                    <View style={[styles.deadlineTag, { flexDirection: 'row', alignItems: 'center', gap: 2 }]}>
                      <Ionicons name="hourglass" size={10} color="#E17055" />
                      <Text style={{ fontSize: 9, fontWeight: '800', color: '#E17055' }}>{getRemainingTime(task.deadline)} left</Text>
                    </View>
                  )}
                </View>
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
  section: { backgroundColor: Colors.surface, padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, shadowColor: Colors.primary, shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, borderWidth: 1, borderColor: Colors.surfaceLight },
  sectionTitle: { fontSize: 24, fontFamily: Typography.heading, color: Colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: Colors.surfaceLight, borderRadius: 12, padding: 4, marginBottom: 15, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: Colors.primary, elevation: 2 },
  tabText: { fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.textDim },
  activeTabText: { color: Colors.background },
  taskCard: { backgroundColor: Colors.surfaceLight, padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: Colors.surfaceLight },
  taskTitle: { fontSize: 16, fontFamily: Typography.subheading, color: Colors.text },
  taskReward: { color: Colors.primary, fontFamily: Typography.subheading, fontSize: 16 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  typeTag: { fontSize: 10, fontFamily: Typography.bodyBold, color: Colors.textDim },
  deadlineTag: { backgroundColor: 'rgba(214, 48, 49, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verifyBtn: { backgroundColor: 'rgba(49, 255, 236, 0.15)', padding: 14, borderRadius: 12, marginTop: 15, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary },
  disabledBtn: { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight },
  btnText: { color: Colors.primary, fontFamily: Typography.subheading, fontSize: 14 },
  rejectionBox: { backgroundColor: 'rgba(214, 48, 49, 0.15)', padding: 12, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: Colors.danger },
  rejectionText: { color: Colors.danger, fontSize: 12, fontFamily: Typography.subheading },
  rejectedCard: { borderLeftWidth: 6, borderLeftColor: Colors.danger },
  poolCard: { backgroundColor: 'rgba(49, 255, 236, 0.05)', padding: 18, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.primary },
  claimBtn: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  badge: { backgroundColor: Colors.danger, minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 2, borderColor: Colors.background },
  badgeText: { color: Colors.text, fontSize: 11, fontFamily: Typography.bodyBold },
  negotiateBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12 },
  negotiateBtnText: { color: Colors.primary, fontFamily: Typography.subheading, fontSize: 12 },
  negotiateForm: { width: '100%' },
  formLabel: { fontSize: 14, fontFamily: Typography.subheading, color: Colors.text },
  input: { backgroundColor: Colors.surfaceLight, borderRadius: 10, padding: 12, fontSize: 14, color: Colors.text, fontFamily: Typography.body, borderWidth: 1, borderColor: 'rgba(49, 255, 236, 0.2)' },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 15 },
  cancelBtnText: { color: Colors.textDim, fontFamily: Typography.subheading, fontSize: 14 },
  submitOfferBtn: { backgroundColor: Colors.secondary, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12 },
});