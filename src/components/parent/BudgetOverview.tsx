import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function BudgetOverview() {
    const { Colors, Typography } = useTheme();
    const { conversionRate, monthlyBudget, setBudgetPolicy, mockUsers } = useTokaStore();
    const [localRate, setLocalRate] = useState(conversionRate.toString());
    const [localBudget, setLocalBudget] = useState(monthlyBudget.toString());

    const outstandingTokens = mockUsers.filter(u => u.role === 'member').reduce((sum, u) => sum + u.tokens, 0);
    const outstandingDollarValue = outstandingTokens * conversionRate;
    const budgetPercentage = monthlyBudget > 0 ? (outstandingDollarValue / monthlyBudget) * 100 : 0;
    const barColor = budgetPercentage > 90 ? Colors.danger : (budgetPercentage > 75 ? Colors.secondary : Colors.tertiary);

    const handleSave = () => {
        const rate = parseFloat(localRate);
        const budget = parseFloat(localBudget);
        if (isNaN(rate) || isNaN(budget) || rate < 0 || budget < 0) { Alert.alert('Invalid Values'); return; }
        setBudgetPolicy(rate, budget);
        Alert.alert('Economy Updated', 'Budget and conversion rate saved.');
    };

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 }}>
                <Ionicons name="wallet" size={20} color={Colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Budget & Economy</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: Colors.surfaceLight }]}>
                <View style={styles.summaryRow}>
                    <View>
                        <Text style={[styles.summaryLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Outstanding Liability</Text>
                        <Text style={[styles.summaryValue, { color: Colors.text, fontFamily: Typography.heading }]}>${outstandingDollarValue.toFixed(2)}</Text>
                        <Text style={[styles.summarySub, { color: Colors.textDim, fontFamily: Typography.body }]}>({outstandingTokens} tokens)</Text>
                    </View>
                    <View>
                        <Text style={[styles.summaryLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold, textAlign: 'right' }]}>Monthly Budget</Text>
                        <Text style={[styles.summaryValue, { color: Colors.primary, fontFamily: Typography.heading, textAlign: 'right' }]}>${monthlyBudget.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: Colors.background }]}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(budgetPercentage, 100)}%` as any, backgroundColor: barColor }]} />
                </View>
                <Text style={[styles.progressText, { color: Colors.textDim, fontFamily: Typography.body }]}>{budgetPercentage.toFixed(1)}% of budget reached</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[{ label: 'Conversion Rate ($)', value: localRate, setter: setLocalRate, helper: 'Ex: 0.01 = 1¢ per token', kb: 'decimal-pad' as const },
                { label: 'Monthly Cap ($)', value: localBudget, setter: setLocalBudget, helper: '', kb: 'decimal-pad' as const }].map(f => (
                    <View key={f.label} style={{ flex: 0.48 }}>
                        <Text style={[styles.miniLabel, { color: Colors.text, fontFamily: Typography.bodyBold }]}>{f.label}</Text>
                        <TextInput style={[styles.input, { backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} value={f.value} onChangeText={f.setter} keyboardType={f.kb} placeholderTextColor={Colors.textDim} />
                        {!!f.helper && <Text style={{ fontSize: 10, color: Colors.textDim, marginTop: 4, fontFamily: Typography.body }}>{f.helper}</Text>}
                    </View>
                ))}
            </View>

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={handleSave}>
                <Text style={[styles.saveBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Save Policy</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
    sectionTitle: { fontSize: 22 },
    summaryCard: { padding: 15, borderRadius: 15, marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    summaryLabel: { fontSize: 11, textTransform: 'uppercase' },
    summaryValue: { fontSize: 24, marginVertical: 2 },
    summarySub: { fontSize: 12 },
    progressBarBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 5 },
    progressText: { fontSize: 11, textAlign: 'right', marginTop: 5 },
    miniLabel: { fontSize: 12, marginBottom: 5 },
    input: { borderRadius: 10, padding: 12, fontSize: 16 },
    saveBtn: { padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
    saveBtnText: { fontSize: 14 },
});
