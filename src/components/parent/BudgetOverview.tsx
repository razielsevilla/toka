import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function BudgetOverview() {
    const { conversionRate, monthlyBudget, setBudgetPolicy, mockUsers } = useTokaStore();

    const [localRate, setLocalRate] = useState(conversionRate.toString());
    const [localBudget, setLocalBudget] = useState(monthlyBudget.toString());

    // Calculate outstanding real-world liability (total tokens held by kids * conversion rate)
    const outstandingTokens = mockUsers
        .filter(u => u.role === 'member')
        .reduce((sum, u) => sum + u.tokens, 0);

    const outstandingDollarValue = outstandingTokens * conversionRate;
    const budgetPercentage = monthlyBudget > 0 ? (outstandingDollarValue / monthlyBudget) * 100 : 0;

    const handleSave = () => {
        const rate = parseFloat(localRate);
        const budget = parseFloat(localBudget);

        if (isNaN(rate) || isNaN(budget) || rate < 0 || budget < 0) {
            Alert.alert("Invalid Values", "Please enter positive numbers for the budget and conversion rate.");
            return;
        }

        setBudgetPolicy(rate, budget);
        Alert.alert("Economy Updated", "The budget and token conversion rate have been saved.");
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Budget & Economy</Text>

            {/* Summary View */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <View>
                        <Text style={styles.summaryLabel}>Outstanding Liability</Text>
                        <Text style={styles.summaryValue}>
                            ${outstandingDollarValue.toFixed(2)}
                        </Text>
                        <Text style={styles.summarySub}>({outstandingTokens} tokens)</Text>
                    </View>
                    <View>
                        <Text style={[styles.summaryLabel, { textAlign: 'right' }]}>Monthly Budget</Text>
                        <Text style={[styles.summaryValue, { textAlign: 'right', color: '#0984e3' }]}>
                            ${monthlyBudget.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={[
                        styles.progressBarFill,
                        {
                            width: `${Math.min(budgetPercentage, 100)}%`,
                            backgroundColor: budgetPercentage > 90 ? '#d63031' : (budgetPercentage > 75 ? '#fdcb6e' : '#00b894')
                        }
                    ]} />
                </View>
                <Text style={styles.progressText}>
                    {budgetPercentage.toFixed(1)}% of budget reached
                </Text>
            </View>

            {/* Economy Settings */}
            <View style={styles.settingsRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.miniLabel}>Conversion Rate ($)</Text>
                    <TextInput
                        style={styles.input}
                        value={localRate}
                        onChangeText={setLocalRate}
                        keyboardType="decimal-pad"
                        placeholder="e.g. 0.01"
                    />
                    <Text style={styles.helperText}>Ex: 0.01 = 1¢ per token</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.miniLabel}>Monthly Cap ($)</Text>
                    <TextInput
                        style={styles.input}
                        value={localBudget}
                        onChangeText={setLocalBudget}
                        keyboardType="decimal-pad"
                        placeholder="e.g. 50.00"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Policy</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },

    summaryCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    summaryLabel: { fontSize: 11, fontWeight: '700', color: '#B2BEC3', textTransform: 'uppercase' },
    summaryValue: { fontSize: 24, fontWeight: '800', color: '#2D3436', marginVertical: 2 },
    summarySub: { fontSize: 12, color: '#636E72' },

    progressBarContainer: { height: 10, backgroundColor: '#DFE6E9', borderRadius: 5, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 5 },
    progressText: { fontSize: 11, fontWeight: '600', color: '#B2BEC3', textAlign: 'right', marginTop: 5 },

    settingsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    inputGroup: { flex: 0.48 },
    miniLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D3436', marginBottom: 5 },
    input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 16, color: '#2D3436' },
    helperText: { fontSize: 10, color: '#B2BEC3', marginTop: 4 },

    saveBtn: { backgroundColor: '#0984e3', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
    saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});
