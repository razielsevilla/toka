import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function BankingPolicy() {
  const { interestRate, interestFrequency, setInterestPolicy, applyInterest } = useTokaStore();
  const [localRate, setLocalRate] = useState((interestRate * 100).toString());
  const [localFreq, setLocalFreq] = useState(interestFrequency);

  const handleSave = () => {
    const rateAsDecimal = parseFloat(localRate) / 100;
    if (isNaN(rateAsDecimal) || rateAsDecimal < 0) {
      Alert.alert("Invalid Rate", "Please enter a valid number.");
      return;
    }
    setInterestPolicy(rateAsDecimal, localFreq);
    Alert.alert("Policy Updated", `Interest is now ${localRate}% applied ${localFreq}.`);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏦 Banking Policy</Text>
      <Text style={styles.miniLabel}>Interest Rate (%)</Text>
      <TextInput style={styles.input} keyboardType="numeric" returnKeyType="done" value={localRate} onChangeText={setLocalRate} />
      <Text style={styles.miniLabel}>Growth Frequency</Text>
      <View style={styles.toggleRow}>
        {(['daily', 'weekly', 'monthly'] as const).map((f) => (
          <TouchableOpacity key={f} style={[styles.toggleBtn, localFreq === f && styles.activeBtn]} onPress={() => setLocalFreq(f)}>
            <Text style={[styles.toggleText, localFreq === f && styles.activeText]}>{f.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Update Policy</Text></TouchableOpacity>
      <TouchableOpacity style={styles.simulateBtn} onPress={() => Alert.alert("Simulate Growth", "Apply interest immediately?", [{ text: "Cancel" }, { text: "Apply Now", onPress: applyInterest }])}>
        <Text style={styles.simulateText}>Prototype: Run Interest Payout Now ⚡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  miniLabel: { fontSize: 10, fontWeight: 'bold', color: '#B2BEC3', marginBottom: 5 },
  input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 16, color: '#2D3436', marginBottom: 15 },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#F1F2F6' },
  activeBtn: { backgroundColor: '#6C5CE7' },
  toggleText: { fontSize: 10, fontWeight: 'bold', color: '#B2BEC3' },
  activeText: { color: '#FFF' },
  saveBtn: { backgroundColor: '#00B894', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  simulateBtn: { marginTop: 15, paddingVertical: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 10, alignItems: 'center' },
  simulateText: { fontSize: 11, color: '#6C5CE7', fontWeight: '700' }
});