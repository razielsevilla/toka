import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Image, Modal } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function ParentDashboard() {
  const { 
    tasks, 
    addTask,
    approveTask, 
    rejectTask, 
    generateInviteCode, 
    mockUsers,
    marketItems, 
    addMarketItem, 
    removeMarketItem,
    notifications,
    clearNotifications,
    vaultBalance,
    addMember
  } = useTokaStore();
  
  // Local state for Task Creation
  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'spontaneous'>('regular');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  
  // --- NEW: State for Custom Android-Friendly Reject Modal ---
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [taskToReject, setTaskToReject] = useState<string | null>(null);

  // Local state for Market Management
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');

  // Local state for Invite Modal
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  // Data Selectors
  const pendingItems = tasks.filter(t => t.status === 'pending');
  const householdMembers = mockUsers.filter(u => u.role === 'member');
  const marketAlerts = notifications.filter(n => n.type === 'market_purchase' && !n.read);

  // --- HANDLERS ---

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

  const handleAddReward = () => {
    if (!itemName || !itemCost) {
      Alert.alert("Error", "Please enter reward name and cost.");
      return;
    }
    addMarketItem({ 
      name: itemName, 
      cost: parseInt(itemCost), 
      type: 'Custom Reward' 
    });
    setItemName('');
    setItemCost('');
  };

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

  // Modal Triggers
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
            onPress: (name : any) => {
              if (name) addMember(name, 'member');
            }
          }
        ]
      );
    }, 500); // slight delay so modal completely closes before alert opens
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 1. MARKET ALERTS */}
        {marketAlerts.length > 0 && (
          <View style={styles.alertBanner}>
            <View style={styles.rowBetween}>
              <Text style={styles.alertTitle}>🔔 Market Claims</Text>
              <TouchableOpacity onPress={() => clearNotifications('market_purchase')}>
                <Text style={styles.dismissText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            {marketAlerts.map(alert => (
              <View key={alert.id} style={styles.alertRow}>
                <Text style={styles.alertText}>• {alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 2. CHILD ACTIVITY TRACKER (Updated with Add Member Card) */}
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

            {/* --- NEW: Add Member Card inside the scroll --- */}
            <TouchableOpacity style={styles.addMemberCard} onPress={openInviteModal}>
              <View style={styles.addMemberIconPlaceholder}>
                <Text style={styles.addMemberPlusText}>+</Text>
              </View>
              <Text style={styles.addMemberCardText}>Add Member</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

        {/* 3. VERIFICATION & APPROVAL QUEUE */}
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

        {/* 4. TASK CREATOR */}
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

        {/* 5. MARKET MANAGEMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Market Rewards</Text>
          <View style={styles.addRewardForm}>
            <TextInput 
              style={[styles.input, { flex: 0.6, marginBottom: 0 }]} 
              placeholder="New Reward" 
              placeholderTextColor="#999" 
              value={itemName} 
              onChangeText={setItemName} 
            />
            <TextInput 
              style={[styles.input, { flex: 0.25, marginBottom: 0 }]} 
              placeholder="Cost" 
              keyboardType="numeric" 
              value={itemCost} 
              onChangeText={setItemCost} 
            />
            <TouchableOpacity style={styles.addBtnSmall} onPress={handleAddReward}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          {marketItems.map(item => (
            <View key={item.id} style={styles.marketEditRow}>
              <View><Text style={styles.marketItemName}>{item.name}</Text><Text style={styles.marketItemCost}>💎 {item.cost}</Text></View>
              <TouchableOpacity onPress={() => removeMarketItem(item.id)}><Text style={styles.removeText}>Remove</Text></TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* --- NEW: INVITATION MODAL --- */}
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
                // In a real app, use Clipboard.setString(inviteCode) here
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
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  alertBanner: { backgroundColor: '#FFF3CD', margin: 15, padding: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#FFC107' },
  alertTitle: { fontWeight: 'bold', color: '#856404', fontSize: 14 },
  dismissText: { color: '#0984E3', fontWeight: 'bold', fontSize: 11 },
  alertRow: { marginTop: 5 },
  alertText: { fontSize: 13, color: '#856404' },
  
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
  
  // --- NEW STYLES FOR ADD MEMBER CARD ---
  addMemberCard: {
    width: 140,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
    marginRight: 15,
  },
  addMemberIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addMemberPlusText: { fontSize: 28, color: '#B2BEC3', fontWeight: 'bold', marginTop: -3 },
  addMemberCardText: { color: '#B2BEC3', fontWeight: 'bold', fontSize: 14 },

  // --- NEW STYLES FOR MODAL ---
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
  
  input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 14, color: '#2D3436', marginBottom: 15 },
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
  addRewardForm: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  addBtnSmall: { backgroundColor: '#6C5CE7', width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  marketEditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  marketItemName: { fontSize: 14, fontWeight: '600', color: '#2D3436' },
  marketItemCost: { fontSize: 12, color: '#00B894', fontWeight: 'bold' },
  removeText: { color: '#D63031', fontSize: 12, fontWeight: 'bold' },
});