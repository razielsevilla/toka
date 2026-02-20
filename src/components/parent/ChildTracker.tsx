import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function ChildTracker() {
  const { tasks, mockUsers, vaultBalance, generateInviteCode, addMember } = useTokaStore();
  const householdMembers = mockUsers.filter(u => u.role === 'member');

  // Local state for Invite Modal
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const openInviteModal = () => {
    setInviteCode(generateInviteCode());
    setIsInviteModalVisible(true);
  };

  const handleMockAdd = () => {
    setIsInviteModalVisible(false);
    setTimeout(() => {
      Alert.prompt(
        "Mock Add Member",
        "Enter child's name for prototype:",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Add", 
            onPress: (name: any) => {
              if (name) addMember(name, 'member');
            }
          }
        ]
      );
    }, 500);
  };

  return (
    <View style={styles.trackerSection}>
      <Text style={styles.sectionTitle}>Child Activity Tracker</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trackerScroll}>
        {householdMembers.map(child => {
          const childTasks = tasks.filter(t => t.assignedTo.includes(child.id));
          const completedCount = childTasks.filter(t => t.status === 'completed').length;
          
          return (
            <View key={child.id} style={styles.childDetailCard}>
              <View style={styles.childHeader}>
                <Text style={styles.detailName}>{child.name.split(' ')[0]}</Text>
                <Text style={styles.detailTokens}>💰 {child.tokens}</Text>
              </View>

              <View style={styles.statsMiniRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>VAULT</Text>
                  <Text style={[styles.statVal, {color: '#6C5CE7'}]}>💎 {vaultBalance}</Text> 
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>STREAK</Text>
                  <Text style={styles.statVal}>🔥 {child.streak}</Text>
                </View>
              </View>

              <Text style={styles.miniLabel}>Chore Progress ({completedCount}/{childTasks.length})</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(completedCount / Math.max(childTasks.length, 1)) * 100}%` }]} />
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.addMemberCard} onPress={openInviteModal}>
          <View style={styles.addMemberIconPlaceholder}>
            <Text style={styles.addMemberPlusText}>+</Text>
          </View>
          <Text style={styles.addMemberCardText}>Add Member</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* INVITATION MODAL */}
      <Modal visible={isInviteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite a Child</Text>
            <Text style={styles.modalSub}>Share this household code to connect their Toka app.</Text>
            
            <View style={styles.codeBox}>
              <Text selectable style={styles.codeTextLarge}>{inviteCode}</Text>
            </View>

            <TouchableOpacity 
              style={styles.copyBtn} 
              onPress={() => {
                Alert.alert("Copied!", "Code copied to clipboard.");
                setIsInviteModalVisible(false);
              }}
            >
              <Text style={styles.copyBtnText}>Copy & Close</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mockAddBtn} onPress={handleMockAdd}>
              <Text style={styles.mockAddText}>Prototype: Mock Add User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  trackerSection: { paddingHorizontal: 15, marginBottom: 15, marginTop: 15 },
  trackerScroll: { paddingVertical: 10 },
  childDetailCard: { backgroundColor: '#FFF', width: 200, minHeight: 140, padding: 15, borderRadius: 20, marginRight: 15, elevation: 2, borderWidth: 1, borderColor: '#EEE' },
  childHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  detailName: { fontWeight: 'bold', fontSize: 16, color: '#2D3436' },
  detailTokens: { color: '#00B894', fontWeight: 'bold' },
  statsMiniRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statBox: { flex: 0.45, backgroundColor: '#F8F9FA', padding: 8, borderRadius: 10, alignItems: 'center' },
  statLabel: { fontSize: 8, color: '#B2BEC3', fontWeight: 'bold' },
  statVal: { fontSize: 14, fontWeight: 'bold', color: '#2D3436' },
  miniLabel: { fontSize: 10, fontWeight: 'bold', color: '#B2BEC3', marginBottom: 5 },
  progressBarBg: { height: 6, backgroundColor: '#E9ECEF', borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: '#6C5CE7', borderRadius: 3 },
  
  addMemberCard: { width: 140, minHeight: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 20, borderWidth: 2, borderColor: '#E9ECEF', borderStyle: 'dashed', marginRight: 15 },
  addMemberIconPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E9ECEF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  addMemberPlusText: { fontSize: 28, color: '#B2BEC3', fontWeight: 'bold', marginTop: -3 },
  addMemberCardText: { color: '#B2BEC3', fontWeight: 'bold', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#2D3436', marginBottom: 10 },
  modalSub: { fontSize: 14, color: '#636E72', textAlign: 'center', marginBottom: 20 },
  codeBox: { backgroundColor: '#F4F1FF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#6C5CE7' },
  codeTextLarge: { fontSize: 32, fontWeight: '900', color: '#6C5CE7', letterSpacing: 5 },
  copyBtn: { backgroundColor: '#6C5CE7', paddingVertical: 14, width: '100%', borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  copyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  mockAddBtn: { paddingVertical: 5 },
  mockAddText: { color: '#0984E3', fontWeight: 'bold', fontSize: 12 },
});