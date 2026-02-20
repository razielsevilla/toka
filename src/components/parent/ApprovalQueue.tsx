import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function ApprovalQueue() {
  const { tasks, mockUsers, approveTask, rejectTask } = useTokaStore();
  const pendingItems = tasks.filter(t => t.status === 'pending');

  const handleReject = (task: any) => {
    if (task.isWithdrawal) {
      Alert.alert(
        "Decline Withdrawal", 
        "Would you like to return these tokens to the child's vault?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Decline", onPress: () => rejectTask(task.id, "Parent declined withdrawal.") }
        ]
      );
      return;
    }

    Alert.prompt(
      "Send Back Chore",
      "What needs to be fixed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Back", onPress: (reason?: string) => rejectTask(task.id, reason || "Needs more work!") }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Approvals Queue</Text>
        <View style={styles.countBadge}><Text style={styles.countText}>{pendingItems.length}</Text></View>
      </View>
      
      {pendingItems.length === 0 ? (
        <Text style={styles.emptyText}>Nothing to approve right now! ✨</Text>
      ) : (
        pendingItems.map(item => (
          <View key={item.id} style={[
            styles.verifyCard, 
            item.isWithdrawal ? styles.withdrawalCard : styles.choreCard
          ]}>
            <View style={styles.verifyInfo}>
              <Text style={styles.verifyTaskName}>
                {item.isWithdrawal ? "💰 Withdrawal Request" : item.title}
              </Text>
              <Text style={styles.verifySubtitle}>
                From: {mockUsers.find(u => u.id === item.assignedTo[0])?.name || 'Child'}
              </Text>
            </View>

            {item.proofUrl && <Image source={{ uri: item.proofUrl }} style={styles.proofPreview} />}
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item)}>
                <Text style={styles.rejectBtnText}>{item.isWithdrawal ? "Decline" : "Send Back"}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.approveBtn, item.isWithdrawal && {backgroundColor: '#6C5CE7'}]} 
                onPress={() => approveTask(item.id)}
              >
                <Text style={styles.approveBtnText}>
                  {item.isWithdrawal ? `Release ${item.reward} 💎` : `Approve & Pay 💎`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countBadge: { backgroundColor: '#D63031', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#B2BEC3', fontStyle: 'italic', marginVertical: 20 },
  verifyCard: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, marginBottom: 10, borderLeftWidth: 5 },
  choreCard: { borderLeftColor: '#F39C12' },
  withdrawalCard: { borderLeftColor: '#6C5CE7' },
  verifyTaskName: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  verifySubtitle: { fontSize: 12, color: '#636E72', marginBottom: 10 },
  verifyInfo: { marginBottom: 10 },
  proofPreview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  rejectBtn: { flex: 0.35, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D63031', padding: 12, borderRadius: 10, alignItems: 'center' },
  rejectBtnText: { color: '#D63031', fontWeight: 'bold', fontSize: 12 },
  approveBtn: { flex: 0.6, backgroundColor: '#00B894', padding: 12, borderRadius: 10, alignItems: 'center' },
  approveBtnText: { color: 'white', fontWeight: 'bold' },
});