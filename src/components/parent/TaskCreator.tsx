import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

type AgeGroup = '4-7' | '8-12' | '13+';
const CHORE_TEMPLATES: Record<AgeGroup, { title: string; reward: string; type: 'regular' | 'spontaneous', freq: 'Daily' | 'Weekly' | 'Monthly' }[]> = {
  '4-7': [{ title: 'Pick up toys', reward: '10', type: 'regular', freq: 'Daily' }, { title: 'Make bed', reward: '15', type: 'regular', freq: 'Daily' }, { title: 'Feed pet', reward: '10', type: 'regular', freq: 'Daily' }, { title: 'Put away clothes', reward: '15', type: 'regular', freq: 'Weekly' }],
  '8-12': [{ title: 'Take out trash', reward: '20', type: 'regular', freq: 'Weekly' }, { title: 'Vacuum room', reward: '30', type: 'regular', freq: 'Weekly' }, { title: 'Wash dishes', reward: '25', type: 'regular', freq: 'Daily' }, { title: 'Help with dinner', reward: '20', type: 'spontaneous', freq: 'Daily' }],
  '13+': [{ title: 'Mow lawn', reward: '100', type: 'regular', freq: 'Weekly' }, { title: 'Clean bathroom', reward: '50', type: 'regular', freq: 'Weekly' }, { title: 'Wash car', reward: '80', type: 'spontaneous', freq: 'Monthly' }, { title: 'Do laundry', reward: '40', type: 'regular', freq: 'Weekly' }],
};

export default function TaskCreator() {
  const { Colors, Typography } = useTheme();
  const { addTask, mockUsers } = useTokaStore();
  const childrenMembers = mockUsers.filter(u => u.role === 'member');
  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'spontaneous'>('regular');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [assignedChild, setAssignedChild] = useState<string | 'anyone'>('anyone');
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('8-12');

  const handleCreateTask = () => {
    if (!taskTitle || !reward) { Alert.alert('Missing Info', 'Please give the task a title and a reward amount.'); return; }
    addTask({ title: taskTitle, reward: parseInt(reward), type: assignedChild === 'anyone' ? 'spontaneous' : taskType, frequency: assignedChild === 'anyone' ? undefined : (taskType === 'regular' ? frequency.toLowerCase() as any : undefined), status: 'open', assignedTo: assignedChild === 'anyone' ? [] : [assignedChild] });
    Alert.alert('Success', assignedChild === 'anyone' ? `Claimable task "${taskTitle}" is live!` : `${taskType} task "${taskTitle}" assigned!`);
    setTaskTitle(''); setReward('');
  };
  const activeTemplates = CHORE_TEMPLATES[selectedAge];

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
      <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Assign New Chore</Text>

      {/* Templates */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 5 }}>
          <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Templates by Age:</Text>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {(Object.keys(CHORE_TEMPLATES) as AgeGroup[]).map(age => (
              <TouchableOpacity key={age} style={[styles.ageBtn, { backgroundColor: selectedAge === age ? Colors.primary : Colors.surfaceLight }]} onPress={() => setSelectedAge(age)}>
                <Text style={[styles.ageBtnText, { color: selectedAge === age ? Colors.white : Colors.textDim, fontFamily: Typography.bodyBold }]}>{age}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {activeTemplates.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.templateCard, { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight }]} onPress={() => { setTaskTitle(item.title); setReward(item.reward); setTaskType(item.type); setFrequency(item.freq); }}>
              <Text style={[styles.templateTitle, { fontFamily: Typography.subheading, color: Colors.text }]}>{item.title}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="diamond" size={12} color={Colors.tertiary} />
                  <Text style={[styles.templateReward, { color: Colors.tertiary, fontFamily: Typography.bodyBold }]}>{item.reward}</Text>
                </View>
                <Text style={[styles.templateFreq, { color: Colors.textDim, backgroundColor: Colors.background, fontFamily: Typography.body }]}>{item.type === 'regular' ? item.freq : 'Instant'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Assign To */}
      <View style={{ marginBottom: 15 }}>
        <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Who is doing this?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8 }}>
          {[{ id: 'anyone', label: 'Anyone (Claimable)', icon: 'people' }, ...childrenMembers.map(c => ({ id: c.id, label: c.name.split(' ')[0], icon: 'person' }))].map(opt => (
            <TouchableOpacity key={opt.id} style={[styles.assignBtn, { backgroundColor: assignedChild === opt.id ? Colors.primary : Colors.surfaceLight }]} onPress={() => setAssignedChild(opt.id)}>
              <Ionicons name={opt.icon as any} size={14} color={assignedChild === opt.id ? Colors.white : Colors.textDim} />
              <Text style={[styles.assignBtnText, { color: assignedChild === opt.id ? Colors.white : Colors.textDim, fontFamily: Typography.bodyBold }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput style={[styles.input, { backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="e.g., Clean the Playroom" placeholderTextColor={Colors.textDim} value={taskTitle} onChangeText={setTaskTitle} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 0.45 }}>
          <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Reward</Text>
          <TextInput style={[styles.input, { backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="Tokens" placeholderTextColor={Colors.textDim} keyboardType="numeric" value={reward} onChangeText={setReward} />
        </View>
        <View style={{ flex: 0.45 }}>
          <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Type</Text>
          <View style={[styles.typeToggle, { backgroundColor: Colors.surfaceLight }]}>
            {(['regular', 'spontaneous'] as const).map(t => (
              <TouchableOpacity key={t} onPress={() => setTaskType(t)} style={[styles.typeBtn, taskType === t && { backgroundColor: Colors.surface, elevation: 2 }]}>
                <Text style={[styles.typeBtnText, { color: taskType === t ? Colors.primary : Colors.textDim, fontFamily: Typography.bodyBold }]}>{t === 'regular' ? 'Regular' : 'Instant'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {taskType === 'regular' && assignedChild !== 'anyone' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 5 }}>
          {(['Daily', 'Weekly', 'Monthly'] as const).map(f => (
            <TouchableOpacity key={f} onPress={() => setFrequency(f)} style={[styles.freqBtn, { borderColor: frequency === f ? Colors.primary : Colors.surfaceLight, backgroundColor: frequency === f ? Colors.primary + '15' : 'transparent' }]}>
              <Text style={[styles.freqBtnText, { color: frequency === f ? Colors.primary : Colors.textDim, fontFamily: Typography.bodyBold }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: Colors.primary }]} onPress={handleCreateTask}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={[styles.submitBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Launch Chore</Text>
          <Ionicons name="rocket" size={18} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
  sectionTitle: { fontSize: 22, marginBottom: 5 },
  ageBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  ageBtnText: { fontSize: 12 },
  templateCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginRight: 10, minWidth: 130, justifyContent: 'space-between', height: 70 },
  templateTitle: { fontSize: 14, marginBottom: 8 },
  templateReward: { fontSize: 13 },
  templateFreq: { fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  input: { borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 15 },
  assignBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  assignBtnText: { fontSize: 12 },
  miniLabel: { fontSize: 10, marginBottom: 5 },
  typeToggle: { flexDirection: 'row', borderRadius: 10, padding: 4 },
  typeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  typeBtnText: { fontSize: 12 },
  freqBtn: { flex: 0.3, paddingVertical: 8, alignItems: 'center', borderRadius: 10, borderWidth: 1 },
  freqBtnText: { fontSize: 12 },
  submitBtn: { padding: 16, borderRadius: 15, alignItems: 'center', elevation: 3 },
  submitBtnText: { fontSize: 16 },
});