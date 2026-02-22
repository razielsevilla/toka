import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function BankingPolicy() {
  const { Colors, Typography } = useTheme();
  const { interestRate, interestFrequency, setInterestPolicy, applyInterest } = useTokaStore();
  const [localRate, setLocalRate] = useState((interestRate * 100).toString());
  const [localFreq, setLocalFreq] = useState(interestFrequency);

  const handleSave = () => {
    const rateAsDecimal = parseFloat(localRate) / 100;
    if (isNaN(rateAsDecimal) || rateAsDecimal < 0) { Alert.alert('Invalid Rate', 'Please enter a valid number.'); return; }
    setInterestPolicy(rateAsDecimal, localFreq);
    Alert.alert('Policy Updated', `Interest is now ${localRate}% applied ${localFreq}.`);
  };

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 }}>
        <Ionicons name="business" size={20} color={Colors.primary} />
        <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Banking Policy</Text>
      </View>
      <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Interest Rate (%)</Text>
      <TextInput style={[styles.input, { backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} keyboardType="numeric" returnKeyType="done" value={localRate} onChangeText={setLocalRate} />
      <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Growth Frequency</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        {(['daily', 'weekly', 'monthly'] as const).map((f) => (
          <TouchableOpacity key={f} style={[styles.toggleBtn, { backgroundColor: localFreq === f ? Colors.primary : Colors.surfaceLight }]} onPress={() => setLocalFreq(f)}>
            <Text style={[styles.toggleText, { color: localFreq === f ? Colors.white : Colors.textDim, fontFamily: Typography.bodyBold }]}>{f.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.tertiary }]} onPress={handleSave}>
        <Text style={[styles.saveBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Update Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.simulateBtn, { borderColor: Colors.surfaceLight }]} onPress={() => Alert.alert('Simulate Growth', 'Apply interest immediately?', [{ text: 'Cancel' }, { text: 'Apply Now', onPress: applyInterest }])}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Text style={[styles.simulateText, { color: Colors.primary, fontFamily: Typography.bodyBold }]}>Prototype: Run Interest Payout Now</Text>
          <Ionicons name="flash" size={14} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
  sectionTitle: { fontSize: 22 },
  miniLabel: { fontSize: 10, marginBottom: 5 },
  input: { borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  toggleText: { fontSize: 10 },
  saveBtn: { padding: 15, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { fontSize: 14 },
  simulateBtn: { marginTop: 15, paddingVertical: 10, borderWidth: 1, borderRadius: 10, alignItems: 'center' },
  simulateText: { fontSize: 11 },
});