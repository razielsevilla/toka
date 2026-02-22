import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function RecurringBills() {
    const { Colors, Typography } = useTheme();
    const { bills, addBill, removeBill, processBills } = useTokaStore();
    const [billTitle, setBillTitle] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [billFrequency, setBillFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    const handleAddBill = () => {
        if (!billTitle || !billAmount) { Alert.alert('Missing Info', 'Provide a name and amount.'); return; }
        const amount = parseInt(billAmount, 10);
        if (isNaN(amount) || amount <= 0) { Alert.alert('Invalid Amount', 'Enter a valid token amount.'); return; }
        addBill({ title: billTitle, amount, frequency: billFrequency });
        setBillTitle(''); setBillAmount('');
    };

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 }}>
                <Ionicons name="receipt" size={20} color={Colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Taxes & Bills</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                {bills.length === 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10, gap: 5 }}>
                        <Text style={[styles.emptyText, { color: Colors.textDim, fontFamily: Typography.body }]}>No active bills. Kids are living rent-free!</Text>
                        <Ionicons name="partly-sunny" size={16} color={Colors.textDim} />
                    </View>
                ) : (
                    bills.map(bill => (
                        <View key={bill.id} style={[styles.billCard, { backgroundColor: Colors.surfaceLight, borderLeftColor: Colors.danger }]}>
                            <View>
                                <Text style={[styles.billTitle, { fontFamily: Typography.subheading, color: Colors.text }]}>{bill.title}</Text>
                                <Text style={[styles.billDetails, { fontFamily: Typography.body, color: Colors.textDim }]}>{bill.amount} tokens / {bill.frequency}</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeBill(bill.id)}>
                                <Text style={{ fontSize: 16, color: Colors.danger, fontWeight: 'bold' }}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <Text style={[styles.subTitle, { fontFamily: Typography.subheading, color: Colors.text }]}>Create New Deduction</Text>
            <TextInput style={[styles.input, { backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="e.g., WiFi Tax, Device Rent" placeholderTextColor={Colors.textDim} value={billTitle} onChangeText={setBillTitle} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 0.45 }}>
                    <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Amount</Text>
                    <TextInput style={[styles.input, { backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="Tokens" placeholderTextColor={Colors.textDim} keyboardType="numeric" value={billAmount} onChangeText={setBillAmount} />
                </View>
                <View style={{ flex: 0.45 }}>
                    <Text style={[styles.miniLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Frequency</Text>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        {(['daily', 'weekly', 'monthly'] as const).map(f => (
                            <TouchableOpacity key={f} onPress={() => setBillFrequency(f)} style={[styles.freqBtn, { backgroundColor: billFrequency === f ? Colors.danger : Colors.surfaceLight }]}>
                                <Text style={[styles.freqBtnText, { color: billFrequency === f ? Colors.white : Colors.textDim, fontFamily: Typography.bodyBold }]}>{f.charAt(0).toUpperCase() + f.slice(1, 3)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: Colors.danger }]} onPress={handleAddBill}>
                <Text style={[styles.submitBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Add Deduction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.simulateBtn, { borderColor: Colors.surfaceLight }]} onPress={processBills}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Text style={[styles.simulateText, { color: Colors.danger, fontFamily: Typography.bodyBold }]}>Prototype: Trigger Bills Now</Text>
                    <Ionicons name="flash" size={14} color={Colors.danger} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
    sectionTitle: { fontSize: 22 },
    subTitle: { fontSize: 14, marginTop: 15, marginBottom: 10 },
    emptyText: { fontSize: 12, fontStyle: 'italic', textAlign: 'center' },
    billCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, borderLeftWidth: 4 },
    billTitle: { fontSize: 14 },
    billDetails: { fontSize: 12, marginTop: 2 },
    input: { borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 10 },
    miniLabel: { fontSize: 10, marginBottom: 5 },
    freqBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    freqBtnText: { fontSize: 11 },
    submitBtn: { padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    submitBtnText: { fontSize: 14 },
    simulateBtn: { marginTop: 15, paddingVertical: 10, borderWidth: 1, borderRadius: 10, alignItems: 'center' },
    simulateText: { fontSize: 11 },
});
