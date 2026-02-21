import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';

type AgeGroup = '4-7' | '8-12' | '13+';

const CHORE_TEMPLATES: Record<AgeGroup, { title: string; reward: string; type: 'regular' | 'spontaneous', freq: 'Daily' | 'Weekly' | 'Monthly' }[]> = {
  '4-7': [
    { title: 'Pick up toys', reward: '10', type: 'regular', freq: 'Daily' },
    { title: 'Make bed', reward: '15', type: 'regular', freq: 'Daily' },
    { title: 'Feed pet', reward: '10', type: 'regular', freq: 'Daily' },
    { title: 'Put away clothes', reward: '15', type: 'regular', freq: 'Weekly' },
  ],
  '8-12': [
    { title: 'Take out trash', reward: '20', type: 'regular', freq: 'Weekly' },
    { title: 'Vacuum room', reward: '30', type: 'regular', freq: 'Weekly' },
    { title: 'Wash dishes', reward: '25', type: 'regular', freq: 'Daily' },
    { title: 'Help with dinner', reward: '20', type: 'spontaneous', freq: 'Daily' },
  ],
  '13+': [
    { title: 'Mow lawn', reward: '100', type: 'regular', freq: 'Weekly' },
    { title: 'Clean bathroom', reward: '50', type: 'regular', freq: 'Weekly' },
    { title: 'Wash car', reward: '80', type: 'spontaneous', freq: 'Monthly' },
    { title: 'Do laundry', reward: '40', type: 'regular', freq: 'Weekly' },
  ]
};

export default function TaskCreator() {
  const { addTask } = useTokaStore();

  const [taskTitle, setTaskTitle] = useState('');
  const [reward, setReward] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'spontaneous'>('regular');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const [selectedAge, setSelectedAge] = useState<AgeGroup>('8-12');

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

  const activeTemplates = CHORE_TEMPLATES[selectedAge];

  const handleSelectTemplate = (template: typeof activeTemplates[0]) => {
    setTaskTitle(template.title);
    setReward(template.reward);
    setTaskType(template.type);
    setFrequency(template.freq);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Assign New Chore</Text>

      {/* Templates Section */}
      <View style={styles.templatesContainer}>
        <View style={styles.ageFilters}>
          <Text style={styles.miniLabel}>Templates by Age:</Text>
          <View style={styles.ageTabs}>
            {(Object.keys(CHORE_TEMPLATES) as AgeGroup[]).map(age => (
              <TouchableOpacity
                key={age}
                style={[styles.ageBtn, selectedAge === age && styles.ageBtnActive]}
                onPress={() => setSelectedAge(age)}
              >
                <Text style={[styles.ageBtnText, selectedAge === age && styles.ageBtnTextActive]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
          {activeTemplates.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateCard}
              onPress={() => handleSelectTemplate(item)}
            >
              <Text style={styles.templateTitle}>{item.title}</Text>
              <View style={styles.templateFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="diamond" size={12} color="#00B894" />
                  <Text style={styles.templateReward}>{item.reward}</Text>
                </View>
                <Text style={styles.templateFreq}>{item.type === 'regular' ? item.freq : 'Instant'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Manual Input Section */}
      <TextInput
        style={styles.input}
        placeholder="e.g., Clean the Playroom"
        placeholderTextColor="#999"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <View style={styles.rowBetween}>
        <View style={{ flex: 0.45 }}>
          <Text style={styles.miniLabel}>Reward</Text>
          <TextInput style={styles.input} placeholder="Tokens" keyboardType="numeric" value={reward} onChangeText={setReward} />
        </View>
        <View style={{ flex: 0.45 }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={styles.submitTaskBtnText}>Launch Chore</Text>
          <Ionicons name="rocket" size={18} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 5 },

  templatesContainer: { marginBottom: 20 },
  ageFilters: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 5 },
  ageTabs: { flexDirection: 'row', gap: 5 },
  ageBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#F1F2F6' },
  ageBtnActive: { backgroundColor: '#6C5CE7' },
  ageBtnText: { fontSize: 12, fontWeight: '600', color: '#B2BEC3' },
  ageBtnTextActive: { color: '#FFF' },

  templatesScroll: { paddingBottom: 5 },
  templateCard: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 130,
    justifyContent: 'space-between'
  },
  templateTitle: { fontSize: 14, fontWeight: '600', color: '#2D3436', marginBottom: 8 },
  templateFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  templateReward: { fontSize: 13, fontWeight: '800', color: '#00B894' },
  templateFreq: { fontSize: 10, fontWeight: '600', color: '#B2BEC3', backgroundColor: '#FFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },

  input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 14, color: '#2D3436', marginBottom: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniLabel: { fontSize: 10, fontWeight: 'bold', color: '#B2BEC3', marginBottom: 5 },
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
});