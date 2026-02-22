import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';

export default function ApprovalQueue() {
  const { tasks, mockUsers, approveTask, rejectTask, acceptCounterOffer, rejectCounterOffer } = useTokaStore();
  const pendingItems = tasks.filter(t => t.status === 'pending' || t.status === 'negotiating');

  const [activeAction, setActiveAction] = useState<{ id: string, type: 'reject' | 'declineOffer' } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const handleRejectClick = (task: any) => {
    if (task.isWithdrawal || task.isAllowanceCashout) {
      Alert.alert(
        task.isAllowanceCashout ? "Decline Cash Out" : "Decline Withdrawal",
        task.isAllowanceCashout ? "Deny the cash out request?" : "Would you like to return these tokens to the child's vault?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Decline", onPress: () => rejectTask(task.id, task.isAllowanceCashout ? "Parent declined cash out." : "Parent declined withdrawal.") }
        ]
      );
      return;
    }

    // For Chore or Counter Offer, show inline input for reason
    setActiveAction({ id: task.id, type: task.status === 'negotiating' ? 'declineOffer' : 'reject' });
    setReasonInput('');
  };

  return (
    <View style={styles.section}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Approvals Queue</Text>
        <View style={styles.countBadge}><Text style={styles.countText}>{pendingItems.length}</Text></View>
      </View>

      {pendingItems.length === 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20, gap: 5 }}>
          <Text style={[styles.emptyText, { marginVertical: 0 }]}>Nothing to approve right now!</Text>
          <Ionicons name="sparkles" size={16} color="#B2BEC3" />
        </View>
      ) : (
        pendingItems.map(item => {
          const isNegotiation = item.status === 'negotiating';
          const childName = mockUsers.find(u => u.id === (isNegotiation ? item.proposedBy : item.assignedTo[0]))?.name || 'Child';

          return (
            <View key={item.id} style={[
              styles.verifyCard,
              (item.isWithdrawal || item.isAllowanceCashout) ? styles.withdrawalCard : isNegotiation ? styles.negotiationCard : styles.choreCard
            ]}>
              <View style={styles.verifyInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  {(item.isWithdrawal || item.isAllowanceCashout) ? <Ionicons name="cash" size={18} color="#6C5CE7" /> : isNegotiation ? <Ionicons name="hand-left" size={18} color="#E17055" /> : null}
                  <Text style={[styles.verifyTaskName, { marginBottom: 0 }]}>
                    {item.isWithdrawal ? "Withdrawal Request" : item.isAllowanceCashout ? "Cash Out Request" : isNegotiation ? "Counter Offer" : item.title}
                  </Text>
                </View>

                {isNegotiation ? (
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.verifySubtitle}>From: {childName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3, gap: 4 }}>
                      <Text style={{ fontWeight: 'bold', color: '#6C5CE7' }}>Asks for: {item.counterOfferAmount}</Text>
                      <Ionicons name="diamond" size={12} color="#6C5CE7" />
                      <Text style={{ fontWeight: 'bold', color: '#6C5CE7' }}>(Original: {item.reward})</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#636E72', fontStyle: 'italic' }}>
                      "{item.counterOfferReason}"
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.verifySubtitle}>From: {childName}</Text>
                )}
              </View>

              {item.proofUrl && !isNegotiation && <Image source={{ uri: item.proofUrl }} style={styles.proofPreview} />}

              <View style={styles.actionRow}>
                {activeAction?.id === item.id ? (
                  <View style={{ width: '100%', gap: 10 }}>
                    <TextInput
                      style={styles.reasonInput}
                      placeholder="Why is it sent back? (e.g. Needs more work...)"
                      value={reasonInput}
                      onChangeText={setReasonInput}
                    />
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity style={[styles.rejectBtn, { flex: 1 }]} onPress={() => setActiveAction(null)}>
                        <Text style={styles.rejectBtnText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.approveBtn, { flex: 1, backgroundColor: '#D63031' }]}
                        onPress={() => {
                          if (activeAction.type === 'declineOffer') {
                            rejectCounterOffer(item.id, reasonInput || "Offer declined.");
                          } else {
                            rejectTask(item.id, reasonInput || "Needs more work!");
                          }
                          setActiveAction(null);
                          setReasonInput('');
                        }}
                      >
                        <Text style={styles.approveBtnText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRejectClick(item)}>
                      <Text style={styles.rejectBtnText}>
                        {(item.isWithdrawal || item.isAllowanceCashout) ? "Decline" : isNegotiation ? "Decline Offer" : "Send Back"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.approveBtn, (item.isWithdrawal || item.isAllowanceCashout || isNegotiation) && { backgroundColor: '#6C5CE7' }]}
                      onPress={() => isNegotiation ? acceptCounterOffer(item.id) : approveTask(item.id)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={styles.approveBtnText}>
                          {(item.isWithdrawal || item.isAllowanceCashout) ? `Approve ${item.reward}` : isNegotiation ? 'Accept Offer' : `Approve & Pay`}
                        </Text>
                        {(item.isWithdrawal || item.isAllowanceCashout) ? <Ionicons name="diamond" size={14} color="white" /> : isNegotiation ? <Ionicons name="sparkles" size={14} color="white" /> : <Ionicons name="diamond" size={14} color="white" />}
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        })
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
  negotiationCard: { borderLeftColor: '#E17055' },
  verifyTaskName: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  verifySubtitle: { fontSize: 12, color: '#636E72', marginBottom: 10 },
  verifyInfo: { marginBottom: 10 },
  proofPreview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  rejectBtn: { flex: 0.35, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D63031', padding: 12, borderRadius: 10, alignItems: 'center' },
  rejectBtnText: { color: '#D63031', fontWeight: 'bold', fontSize: 12 },
  approveBtn: { flex: 0.6, backgroundColor: '#00B894', padding: 12, borderRadius: 10, alignItems: 'center' },
  approveBtnText: { color: 'white', fontWeight: 'bold' },
  reasonInput: { backgroundColor: '#F1F2F6', borderRadius: 8, padding: 10, fontSize: 13, color: '#2D3436' },
});