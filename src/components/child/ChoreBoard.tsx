import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

function getRemainingTime(deadline?: number) {
  if (!deadline) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export default function ChoreBoard() {
  const { Colors, Typography } = useTheme();
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
    if (!result.canceled) { submitTask(taskId, result.assets[0].uri); clearNotifications('rejection'); Alert.alert('Sent for Review!', 'Mom or Dad will check it soon.'); }
  };

  const handleSendOffer = (taskId: string) => {
    if (!counterAmount || !counterReason) { Alert.alert('Missing Info', 'Please provide how many tokens you want, and why!'); return; }
    const amountNum = parseInt(counterAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) { Alert.alert('Invalid Amount', 'Tokens must be a positive number.'); return; }
    submitCounterOffer(taskId, currentUser?.id || '', amountNum, counterReason);
    setNegotiatingTaskId(null); setCounterAmount(''); setCounterReason('');
  };

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight, shadowColor: Colors.primary }]}>
      <View style={styles.row}>
        <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Chore Board</Text>
        {choreNotifs > 0 && <View style={[styles.badge, { backgroundColor: Colors.danger, borderColor: Colors.background }]}><Text style={[styles.badgeText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>{choreNotifs}</Text></View>}
      </View>

      <View style={[styles.tabContainer, { backgroundColor: Colors.surfaceLight }]}>
        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => { setActiveTab(tab); clearNotifications('task'); }}
            style={[styles.tabButton, activeTab === tab && { backgroundColor: Colors.primary }]}
          >
            <Text style={[styles.tabText, { fontFamily: Typography.bodyBold, color: activeTab === tab ? Colors.white : Colors.textDim }]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTasks.map(task => (
        <View key={task.id} style={[styles.taskCard, { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight }, task.rejectionReason && { borderLeftWidth: 5, borderLeftColor: Colors.danger }]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={[styles.taskTitle, { fontFamily: Typography.subheading, color: Colors.text }]}>{task.title}</Text>
              <View style={styles.tagsRow}>
                {task.type === 'spontaneous' && <Ionicons name="flash" size={10} color={Colors.textDim} />}
                <Text style={[styles.typeTag, { fontFamily: Typography.bodyBold, color: Colors.textDim }]}>{task.type === 'spontaneous' ? 'INSTANT' : task.frequency?.toUpperCase()}</Text>
                {task.deadline && (
                  <View style={styles.deadlineTag}>
                    <Ionicons name="hourglass" size={10} color="#E17055" />
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#E17055' }}>{getRemainingTime(task.deadline)} left</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="diamond" size={14} color={Colors.primary} />
              <Text style={[styles.taskReward, { fontFamily: Typography.subheading, color: Colors.primary }]}>{task.reward}</Text>
            </View>
          </View>
          {task.rejectionReason && (
            <View style={[styles.rejectionBox, { backgroundColor: Colors.danger + '20', borderColor: Colors.danger }]}>
              <Ionicons name="chatbubble-ellipses" size={12} color={Colors.danger} />
              <Text style={[styles.rejectionText, { color: Colors.danger, fontFamily: Typography.subheading }]}>Fix: "{task.rejectionReason}"</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.verifyBtn, { backgroundColor: Colors.primary + '18', borderColor: Colors.primary }, task.status === 'pending' && { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight }]}
            onPress={() => handleVerify(task.id)}
            disabled={task.status === 'pending'}
          >
            <Text style={[{ fontFamily: Typography.subheading, fontSize: 14, color: task.status === 'pending' ? Colors.textDim : Colors.primary }]}>{task.status === 'pending' ? 'Reviewing...' : 'Verify  📷'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {activeTab === 'daily' && availablePool.map(task => (
        <View key={task.id} style={[styles.poolCard, { backgroundColor: Colors.primary + '08', borderColor: Colors.primary }]}>
          {negotiatingTaskId === task.id ? (
            <View style={{ width: '100%' }}>
              <Text style={[{ fontSize: 14, fontFamily: Typography.subheading, color: Colors.text, marginBottom: 8 }]}>Negotiating: {task.title}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <TextInput style={[styles.input, { flex: 0.3, backgroundColor: Colors.surfaceLight, color: Colors.text, borderColor: Colors.primary + '44' }]} placeholder="Amt" keyboardType="numeric" value={counterAmount} onChangeText={setCounterAmount} />
                <TextInput style={[styles.input, { flex: 0.7, backgroundColor: Colors.surfaceLight, color: Colors.text, borderColor: Colors.primary + '44' }]} placeholder="Reason?" value={counterReason} onChangeText={setCounterReason} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 15 }} onPress={() => setNegotiatingTaskId(null)}><Text style={{ color: Colors.textDim, fontFamily: Typography.subheading }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.claimBtn, { backgroundColor: Colors.secondary }]} onPress={() => handleSendOffer(task.id)}><Text style={{ color: Colors.white, fontFamily: Typography.subheading }}>Send Offer ✨</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View>
                <Text style={[styles.taskTitle, { fontFamily: Typography.subheading, color: Colors.text }]}>{task.title}</Text>
                <View style={styles.tagsRow}>
                  <Ionicons name="diamond" size={14} color={Colors.primary} /><Text style={[styles.taskReward, { fontFamily: Typography.subheading, color: Colors.primary }]}>{task.reward}</Text>
                  {task.deadline && <View style={styles.deadlineTag}><Ionicons name="hourglass" size={10} color="#E17055" /><Text style={{ fontSize: 9, fontWeight: '800', color: '#E17055' }}>{getRemainingTime(task.deadline)} left</Text></View>}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.negotiateBtn, { borderColor: Colors.primary }]} onPress={() => setNegotiatingTaskId(task.id)}><Text style={{ color: Colors.primary, fontFamily: Typography.subheading, fontSize: 12 }}>Negotiate</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.claimBtn, { backgroundColor: Colors.primary }]} onPress={() => acceptTask(task.id, currentUser?.id || '')}><Text style={{ color: Colors.white, fontFamily: Typography.subheading }}>Claim</Text></TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, borderWidth: 1 },
  sectionTitle: { fontSize: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 15, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 11 },
  taskCard: { padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1 },
  taskTitle: { fontSize: 16 },
  taskReward: { fontSize: 16 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  typeTag: { fontSize: 10 },
  deadlineTag: { backgroundColor: 'rgba(225, 112, 85, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 2 },
  verifyBtn: { padding: 14, borderRadius: 12, marginTop: 15, alignItems: 'center', borderWidth: 1 },
  rejectionBox: { padding: 10, borderRadius: 10, marginTop: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  rejectionText: { fontSize: 12 },
  poolCard: { padding: 18, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1 },
  claimBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 2 },
  badgeText: { fontSize: 11 },
  negotiateBtn: { backgroundColor: 'transparent', borderWidth: 1, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12 },
  input: { borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1 },
});