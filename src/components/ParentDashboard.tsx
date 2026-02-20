import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function ParentDashboard() {
  const { 
    tasks, 
    approveTask, 
    rejectTask, 
    generateInviteCode, 
    mockUsers,
    marketItems, 
    addMarketItem, 
    removeMarketItem,
    notifications,
    clearNotifications,
    transactions,
    vaultBalance
  } = useTokaStore();
  
  // Local state for Task Creation
  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'spontaneous'>('regular');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  // Local state for Market Management
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');

  // Data Selectors
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const householdMembers = mockUsers.filter(u => u.role === 'member');
  const marketAlerts = notifications.filter(n => n.type === 'market_purchase' && !n.read);

  const handleCreateTask = () => {
    if (!taskTitle || !reward) {
      Alert.alert("Missing Info", "Please give the task a title and a reward amount.");
      return;
    }
    Alert.alert("Success", `${taskType} task "${taskTitle}" created!`);
    setTaskTitle('');
    setReward('');
  };

  const handleReject = (taskId: string) => {
    Alert.prompt(
      "Send Back Chore",
      "What needs to be fixed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Back", 
          onPress: (reason?: string) => rejectTask(taskId, reason || "Needs more work!") 
        }
      ]
    );
  };

  const handleAddReward = () => {
    if (!itemName || !itemCost) return;
    addMarketItem({ name: itemName, cost: parseInt(itemCost), type: 'Custom Reward' });
    setItemName('');
    setItemCost('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* --- 1. MARKET ALERTS (Notifications for Parents) --- */}
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

      {/* --- 2. CHILD ACTIVITY TRACKER (Horizontal Oversight) --- */}
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
                    <Text style={styles.statVal}>💎 {vaultBalance}</Text> 
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
          
          {/* Add Member Shortcut */}
          <TouchableOpacity style={styles.addMemberCard} onPress={() => Alert.alert("Invite Code", generateInviteCode())}>
             <Text style={styles.addIcon}>+</Text>
             <Text style={styles.addText}>Add Member</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* --- 3. VERIFICATION QUEUE --- */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Verification Queue</Text>
          <View style={styles.countBadge}><Text style={styles.countText}>{pendingTasks.length}</Text></View>
        </View>
        
        {pendingTasks.length === 0 ? (
          <Text style={styles.emptyText}>All chores are up to date! ✨</Text>
        ) : (
          pendingTasks.map(task => (
            <View key={task.id} style={styles.verifyCard}>
              <View style={styles.verifyInfo}>
                <Text style={styles.verifyTaskName}>{task.title}</Text>
                <Text style={styles.verifySubtitle}>Submitted by: {task.assignedTo[0] || 'Child'}</Text>
              </View>
              {task.proofUrl && <Image source={{ uri: task.proofUrl }} style={styles.proofPreview} />}
              
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(task.id)}>
                  <Text style={styles.rejectBtnText}>Send Back ❌</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveBtn} onPress={() => approveTask(task.id)}>
                  <Text style={styles.approveBtnText}>Approve 💎 {task.reward}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* --- 4. TASK CREATOR --- */}
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
        <TouchableOpacity style={styles.submitTaskBtn} onPress={handleCreateTask}>
          <Text style={styles.submitTaskBtnText}>Launch Chore 🚀</Text>
        </TouchableOpacity>
      </View>

      {/* --- 5. MARKET MANAGEMENT --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manage Market Rewards</Text>
        <View style={styles.addRewardForm}>
          <TextInput style={[styles.input, { flex: 0.6, marginBottom: 0 }]} placeholder="New Reward" placeholderTextColor="#999" value={itemName} onChangeText={setItemName} />
          <TextInput style={[styles.input, { flex: 0.25, marginBottom: 0 }]} placeholder="Cost" keyboardType="numeric" value={itemCost} onChangeText={setItemCost} />
          <TouchableOpacity style={styles.addBtnSmall} onPress={handleAddReward}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
        </View>
        {marketItems.map(item => (
          <View key={item.id} style={styles.marketEditRow}>
            <View><Text style={styles.marketItemName}>{item.name}</Text><Text style={styles.marketItemCost}>💎 {item.cost}</Text></View>
            <TouchableOpacity onPress={() => removeMarketItem(item.id)}><Text style={styles.removeText}>Remove</Text></TouchableOpacity>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Alert Banner
  alertBanner: { backgroundColor: '#FFF3CD', margin: 15, padding: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#FFC107' },
  alertTitle: { fontWeight: 'bold', color: '#856404', fontSize: 14 },
  dismissText: { color: '#0984E3', fontWeight: 'bold', fontSize: 11 },
  alertRow: { marginTop: 5 },
  alertText: { fontSize: 13, color: '#856404' },

  // Activity Tracker
  trackerSection: { paddingHorizontal: 15, marginBottom: 15 },
  trackerScroll: { paddingVertical: 10 },
  childDetailCard: { backgroundColor: '#FFF', width: 200, padding: 15, borderRadius: 20, marginRight: 15, elevation: 2, borderWidth: 1, borderColor: '#EEE' },
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
  addMemberCard: { width: 120, backgroundColor: 'rgba(108, 92, 231, 0.1)', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center', height: 140 },
  addIcon: { fontSize: 32, color: '#6C5CE7', fontWeight: 'bold' },
  addText: { fontSize: 12, color: '#6C5CE7', fontWeight: 'bold' },

  // Verification & Other (Re-used from previous)
  countBadge: { backgroundColor: '#D63031', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#B2BEC3', fontStyle: 'italic', marginVertical: 20 },
  verifyCard: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#F39C12' },
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