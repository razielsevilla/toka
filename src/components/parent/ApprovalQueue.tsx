import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function ApprovalQueue() {
  const { Colors, Typography } = useTheme();
  const { tasks, mockUsers, approveTask, rejectTask, acceptCounterOffer, rejectCounterOffer } = useTokaStore();
  const pendingItems = tasks.filter(t => t.status === 'pending' || t.status === 'negotiating');
  const [activeAction, setActiveAction] = useState<{ id: string, type: 'reject' | 'declineOffer' } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const handleRejectClick = (task: any) => {
    if (task.isWithdrawal || task.isAllowanceCashout) {
      Alert.alert(task.isAllowanceCashout ? 'Decline Cash Out' : 'Decline Withdrawal', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Decline', onPress: () => rejectTask(task.id, task.isAllowanceCashout ? 'Parent declined cash out.' : 'Parent declined withdrawal.') }
      ]);
      return;
    }
    setActiveAction({ id: task.id, type: task.status === 'negotiating' ? 'declineOffer' : 'reject' });
    setReasonInput('');
  };

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
      <View style={styles.rowBetween}>
        <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Approvals Queue</Text>
        <View style={[styles.countBadge, { backgroundColor: Colors.danger }]}>
          <Text style={[styles.countText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>{pendingItems.length}</Text>
        </View>
      </View>

      {pendingItems.length === 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20, gap: 5 }}>
          <Text style={[styles.emptyText, { color: Colors.textDim, fontFamily: Typography.body }]}>Nothing to approve right now!</Text>
          <Ionicons name="sparkles" size={16} color={Colors.textDim} />
        </View>
      ) : (
        pendingItems.map(item => {
          const isNegotiation = item.status === 'negotiating';
          const childName = mockUsers.find(u => u.id === (isNegotiation ? item.proposedBy : item.assignedTo[0]))?.name || 'Child';
          const isFinancial = item.isWithdrawal || item.isAllowanceCashout;
          const accent = isFinancial ? Colors.primary : isNegotiation ? Colors.secondary : Colors.tertiary;

          return (
            <View key={item.id} style={[styles.verifyCard, { backgroundColor: Colors.surfaceLight, borderLeftColor: accent }]}>
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  {isFinancial ? <Ionicons name="cash" size={18} color={accent} /> : isNegotiation ? <Ionicons name="hand-left" size={18} color={accent} /> : null}
                  <Text style={[styles.verifyTaskName, { fontFamily: Typography.subheading, color: Colors.text }]}>
                    {item.isWithdrawal ? 'Withdrawal Request' : item.isAllowanceCashout ? 'Cash Out Request' : isNegotiation ? 'Counter Offer' : item.title}
                  </Text>
                </View>
                {isNegotiation ? (
                  <View style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 12, color: Colors.textDim, fontFamily: Typography.body }}>From: {childName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3, gap: 4 }}>
                      <Text style={{ fontFamily: Typography.subheading, color: accent }}>Asks for: {item.counterOfferAmount}</Text>
                      <Ionicons name="diamond" size={12} color={accent} />
                      <Text style={{ fontFamily: Typography.subheading, color: accent }}>(Original: {item.reward})</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: Colors.textDim, fontStyle: 'italic', fontFamily: Typography.body }}>"{item.counterOfferReason}"</Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 12, color: Colors.textDim, fontFamily: Typography.body, marginBottom: 10 }}>From: {childName}</Text>
                )}
              </View>
              {item.proofUrl && !isNegotiation && <Image source={{ uri: item.proofUrl }} style={styles.proofPreview} />}

              <View style={{ marginTop: 10 }}>
                {activeAction?.id === item.id ? (
                  <View style={{ gap: 10 }}>
                    <TextInput
                      style={[styles.reasonInput, { backgroundColor: Colors.background, color: Colors.text, borderColor: Colors.surfaceLight, fontFamily: Typography.body }]}
                      placeholder="Why is it sent back? (e.g. Needs more work...)"
                      placeholderTextColor={Colors.textDim}
                      value={reasonInput}
                      onChangeText={setReasonInput}
                    />
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity style={[styles.rejectBtn, { flex: 1, borderColor: Colors.surfaceLight }]} onPress={() => setActiveAction(null)}>
                        <Text style={[styles.rejectBtnText, { color: Colors.textDim, fontFamily: Typography.subheading }]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.approveBtn, { flex: 1, backgroundColor: Colors.danger }]}
                        onPress={() => { activeAction.type === 'declineOffer' ? rejectCounterOffer(item.id, reasonInput || 'Offer declined.') : rejectTask(item.id, reasonInput || 'Needs more work!'); setActiveAction(null); setReasonInput(''); }}>
                        <Text style={[styles.approveBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.rejectBtn, { borderColor: Colors.danger }]} onPress={() => handleRejectClick(item)}>
                      <Text style={[styles.rejectBtnText, { color: Colors.danger, fontFamily: Typography.subheading }]}>
                        {isFinancial ? 'Decline' : isNegotiation ? 'Decline Offer' : 'Send Back'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.approveBtn, { backgroundColor: accent }]} onPress={() => isNegotiation ? acceptCounterOffer(item.id) : approveTask(item.id)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={[styles.approveBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>
                          {isFinancial ? `Approve ${item.reward}` : isNegotiation ? 'Accept Offer' : 'Approve & Pay'}
                        </Text>
                        <Ionicons name="diamond" size={14} color={Colors.white} />
                      </View>
                    </TouchableOpacity>
                  </View>
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
  section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
  sectionTitle: { fontSize: 22, marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 12 },
  emptyText: { textAlign: 'center', fontStyle: 'italic' },
  verifyCard: { borderRadius: 15, padding: 15, marginBottom: 10, borderLeftWidth: 5 },
  verifyTaskName: { fontSize: 16 },
  proofPreview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rejectBtn: { flex: 0.35, backgroundColor: 'transparent', borderWidth: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  rejectBtnText: { fontSize: 12 },
  approveBtn: { flex: 0.6, padding: 12, borderRadius: 10, alignItems: 'center' },
  approveBtnText: { fontSize: 12 },
  reasonInput: { borderRadius: 8, padding: 10, fontSize: 13, borderWidth: 1 },
});