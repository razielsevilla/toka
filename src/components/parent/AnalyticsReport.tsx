import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function AnalyticsReport() {
    const { Colors, Typography } = useTheme();
    const { tasks, transactions, mockUsers } = useTokaStore();
    const members = mockUsers.filter(u => u.role === 'member');
    if (members.length === 0) return null;

    const relevantTasks = tasks.filter(t => t.assignedTo.length > 0 || t.status === 'completed');
    const completedTasks = relevantTasks.filter(t => t.status === 'completed').length;
    const completionRate = relevantTasks.length > 0 ? (completedTasks / relevantTasks.length) * 100 : 0;
    const totalEarned = transactions.filter(tx => tx.type === 'earn').reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = transactions.filter(tx => tx.type === 'spend').reduce((sum, tx) => sum + tx.amount, 0);
    const spendingRatio = totalEarned > 0 ? (totalSpent / totalEarned) * 100 : 0;
    const topEarner = [...members].sort((a, b) => b.tokens - a.tokens)[0];

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 }}>
                <Ionicons name="bar-chart" size={20} color={Colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Household Analytics</Text>
            </View>

            <View style={styles.metricsGrid}>
                <View style={[styles.metricCard, { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight }]}>
                    <Text style={[styles.metricValue, { fontFamily: Typography.heading, color: Colors.primary }]}>{completionRate.toFixed(0)}%</Text>
                    <Text style={[styles.metricLabel, { fontFamily: Typography.bodyBold, color: Colors.textDim }]}>Chores Completed</Text>
                    <View style={[styles.miniBarBg, { backgroundColor: Colors.background }]}>
                        <View style={[styles.miniBarFill, { width: `${completionRate}%` as any, backgroundColor: completionRate > 70 ? Colors.tertiary : Colors.secondary }]} />
                    </View>
                </View>
                <View style={[styles.metricCard, { backgroundColor: Colors.surfaceLight, borderColor: Colors.surfaceLight }]}>
                    <Text style={[styles.metricValue, { fontFamily: Typography.heading, color: Colors.danger }]}>{spendingRatio.toFixed(0)}%</Text>
                    <Text style={[styles.metricLabel, { fontFamily: Typography.bodyBold, color: Colors.textDim }]}>Earnings Spent</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 10, fontStyle: 'italic', color: Colors.textDim, fontFamily: Typography.body }}>{spendingRatio > 80 ? 'High Spenders' : 'Great Savers'}</Text>
                        <Ionicons name={spendingRatio > 80 ? 'cash-outline' : 'business-outline'} size={12} color={Colors.textDim} />
                    </View>
                </View>
            </View>

            <View style={[styles.ribbonCard, { backgroundColor: Colors.secondary + '18', borderColor: Colors.secondary + '44' }]}>
                <View style={[styles.ribbonIcon, { backgroundColor: Colors.surface }]}>
                    <Ionicons name="trophy" size={24} color={Colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.ribbonTitle, { fontFamily: Typography.subheading, color: Colors.secondary }]}>Top Earner</Text>
                    <Text style={[styles.ribbonSub, { fontFamily: Typography.body, color: Colors.text }]}>{topEarner?.name || 'No one yet'} ({topEarner?.tokens || 0} tokens)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
    sectionTitle: { fontSize: 22 },
    metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    metricCard: { flex: 0.48, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1 },
    metricValue: { fontSize: 24, marginBottom: 5 },
    metricLabel: { fontSize: 11, textAlign: 'center', marginBottom: 8 },
    miniBarBg: { width: '100%', height: 4, borderRadius: 2 },
    miniBarFill: { height: '100%', borderRadius: 2 },
    ribbonCard: { flexDirection: 'row', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1 },
    ribbonIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2 },
    ribbonTitle: { fontSize: 13 },
    ribbonSub: { fontSize: 12, marginTop: 2 },
});
