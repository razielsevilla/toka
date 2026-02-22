import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function ChildTracker() {
  const { Colors, Typography } = useTheme();
  const { tasks, mockUsers, vaultBalance, generateInviteCode, addMember } = useTokaStore();
  const householdMembers = mockUsers.filter(u => u.role === 'member');
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [modalMode, setModalMode] = useState<'link' | 'manual'>('link');
  const [newChildName, setNewChildName] = useState('');

  const openInviteModal = () => { setInviteCode(generateInviteCode()); setModalMode('link'); setNewChildName(''); setIsInviteModalVisible(true); };
  const handleManualAdd = () => {
    if (!newChildName.trim()) { Alert.alert('Oops!', 'Please enter a name.'); return; }
    addMember(newChildName.trim(), 'member'); setIsInviteModalVisible(false); setNewChildName('');
  };

  return (
    <View style={{ paddingHorizontal: 15, marginBottom: 15, marginTop: 15 }}>
      <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Child Activity Tracker</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10 }}>
        {householdMembers.map(child => {
          const childTasks = tasks.filter(t => t.assignedTo.includes(child.id));
          const completedCount = childTasks.filter(t => t.status === 'completed').length;
          return (
            <View key={child.id} style={[styles.childCard, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
              <View style={styles.childHeader}>
                <Text style={[styles.detailName, { fontFamily: Typography.subheading, color: Colors.text }]}>{child.name.split(' ')[0]}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="diamond" size={14} color={Colors.tertiary} />
                  <Text style={[styles.detailTokens, { color: Colors.tertiary, fontFamily: Typography.subheading }]}>{child.tokens}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                {[{ label: 'VAULT', value: vaultBalance, icon: 'diamond', color: Colors.primary }, { label: 'STREAK', value: child.streak, icon: 'flame', color: '#E17055' }].map(s => (
                  <View key={s.label} style={[styles.statBox, { backgroundColor: Colors.surfaceLight }]}>
                    <Text style={[styles.statLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>{s.label}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name={s.icon as any} size={12} color={s.color} />
                      <Text style={[styles.statVal, { color: s.color, fontFamily: Typography.subheading }]}>{s.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Chore Progress ({completedCount}/{childTasks.length})</Text>
              <View style={[styles.progressBarBg, { backgroundColor: Colors.surfaceLight }]}>
                <View style={[styles.progressBarFill, { width: `${(completedCount / Math.max(childTasks.length, 1)) * 100}%` as any, backgroundColor: Colors.primary }]} />
              </View>
            </View>
          );
        })}
        <TouchableOpacity style={[styles.addMemberCard, { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight }]} onPress={openInviteModal}>
          <View style={[styles.addMemberIcon, { backgroundColor: Colors.background }]}>
            <Text style={[styles.addMemberPlus, { color: Colors.textDim }]}>+</Text>
          </View>
          <Text style={[styles.addMemberText, { color: Colors.textDim, fontFamily: Typography.subheading }]}>Add Member</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isInviteModalVisible} transparent animationType="slide">
        <View style={[styles.modalOverlay]}>
          <View style={[styles.modalContent, { backgroundColor: Colors.surface }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={[styles.modalTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Add a Member</Text>
              <TouchableOpacity onPress={() => setIsInviteModalVisible(false)} style={[styles.closeBtnIcon, { backgroundColor: Colors.surfaceLight }]}>
                <Ionicons name="close" size={18} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.tabContainer, { backgroundColor: Colors.surfaceLight }]}>
              {(['link', 'manual'] as const).map(m => (
                <TouchableOpacity key={m} style={[styles.tabBtn, modalMode === m && { backgroundColor: Colors.surface }]} onPress={() => setModalMode(m)}>
                  <Text style={[styles.tabText, { color: modalMode === m ? Colors.primary : Colors.textDim, fontFamily: Typography.subheading }]}>{m === 'link' ? 'Link Device' : 'Add Manually'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {modalMode === 'link' ? (
              <View style={{ minHeight: 180 }}>
                <Text style={[styles.modalSub, { color: Colors.textDim, fontFamily: Typography.body }]}>Give this code to your child to join your household on their phone.</Text>
                <View style={[styles.codeBox, { backgroundColor: Colors.primary + '15', borderColor: Colors.primary }]}>
                  <Text selectable style={[styles.codeText, { color: Colors.primary, fontFamily: Typography.heading }]}>{inviteCode}</Text>
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary }]} onPress={() => { Alert.alert('Copied!', 'Code copied.'); setIsInviteModalVisible(false); }}>
                  <Text style={[styles.actionBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Copy & Share Link</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ minHeight: 180 }}>
                <Text style={[styles.modalSub, { color: Colors.textDim, fontFamily: Typography.body }]}>Create a profile for a child directly on this device.</Text>
                <TextInput style={[styles.modalInput, { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="Child's First Name" placeholderTextColor={Colors.textDim} value={newChildName} onChangeText={setNewChildName} maxLength={15} />
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary }]} onPress={handleManualAdd}>
                  <Text style={[styles.actionBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Create Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 22, marginBottom: 5 },
  childCard: { width: 200, minHeight: 140, padding: 15, borderRadius: 20, marginRight: 15, elevation: 2, borderWidth: 1 },
  childHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  detailName: { fontSize: 16 },
  detailTokens: { fontSize: 14 },
  statBox: { flex: 0.45, padding: 8, borderRadius: 10, alignItems: 'center' },
  statLabel: { fontSize: 8 },
  statVal: { fontSize: 14 },
  miniLabel: { fontSize: 10, marginBottom: 5 },
  progressBarBg: { height: 6, borderRadius: 3 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  addMemberCard: { width: 140, minHeight: 140, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', marginRight: 15 },
  addMemberIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  addMemberPlus: { fontSize: 28, fontWeight: 'bold', marginTop: -3 },
  addMemberText: { fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50, elevation: 10 },
  modalTitle: { fontSize: 22 },
  closeBtnIcon: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 14 },
  modalSub: { fontSize: 13, marginBottom: 20, lineHeight: 18 },
  codeBox: { paddingVertical: 20, paddingHorizontal: 30, borderRadius: 15, marginBottom: 20, borderWidth: 1, alignItems: 'center' },
  codeText: { fontSize: 36, letterSpacing: 8 },
  modalInput: { borderWidth: 1, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 20 },
  actionBtn: { paddingVertical: 16, width: '100%', borderRadius: 15, alignItems: 'center' },
  actionBtnText: { fontSize: 16 },
});