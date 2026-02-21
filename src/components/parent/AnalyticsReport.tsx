import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function AnalyticsReport() {
    const { tasks, transactions, mockUsers } = useTokaStore();

    const members = mockUsers.filter(u => u.role === 'member');
    if (members.length === 0) return null;

    // 1. Chore Completion Rate
    // Exclude spontaneous tasks that haven't been accepted yet
    const relevantTasks = tasks.filter(t => t.assignedTo.length > 0 || t.status === 'completed');
    const completedTasks = relevantTasks.filter(t => t.status === 'completed').length;
    const completionRate = relevantTasks.length > 0 ? (completedTasks / relevantTasks.length) * 100 : 0;

    // 2. Earnings vs. Spending
    const totalEarned = transactions
        .filter(tx => tx.type === 'earn')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalSpent = transactions
        .filter(tx => tx.type === 'spend')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const spendingRatio = totalEarned > 0 ? (totalSpent / totalEarned) * 100 : 0;

    // 3. Finding the Top Hustler (Most tokens)
    const topEarner = [...members].sort((a, b) => b.tokens - a.tokens)[0];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Household Analytics</Text>

            <View style={styles.metricsGrid}>
                {/* Metric 1: Chore Completion */}
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{completionRate.toFixed(0)}%</Text>
                    <Text style={styles.metricLabel}>Chores Completed</Text>
                    <View style={styles.miniBarBg}>
                        <View style={[styles.miniBarFill, { width: `${completionRate}%`, backgroundColor: completionRate > 70 ? '#00b894' : '#fdcb6e' }]} />
                    </View>
                </View>

                {/* Metric 2: Spending Habit */}
                <View style={styles.metricCard}>
                    <Text style={[styles.metricValue, { color: '#E17055' }]}>{spendingRatio.toFixed(0)}%</Text>
                    <Text style={styles.metricLabel}>Earnings Spent</Text>
                    <Text style={styles.helperText}>
                        {spendingRatio > 80 ? "High Spenders 💸" : "Great Savers 🏦"}
                    </Text>
                </View>
            </View>

            {/* Top Performer Ribbon */}
            <View style={styles.ribbonCard}>
                <View style={styles.ribbonIcon}>
                    <Text style={{ fontSize: 24 }}>🏆</Text>
                </View>
                <View style={styles.ribbonContent}>
                    <Text style={styles.ribbonTitle}>Top Earner</Text>
                    <Text style={styles.ribbonSub}>{topEarner?.name || 'No one yet'} ({topEarner?.tokens || 0} tokens)</Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },

    metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    metricCard: { flex: 0.48, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#F1F2F6' },
    metricValue: { fontSize: 24, fontWeight: '900', color: '#0984e3', marginBottom: 5 },
    metricLabel: { fontSize: 11, fontWeight: '700', color: '#636E72', textAlign: 'center', marginBottom: 8 },
    miniBarBg: { width: '100%', height: 4, backgroundColor: '#E9ECEF', borderRadius: 2 },
    miniBarFill: { height: '100%', borderRadius: 2 },
    helperText: { fontSize: 10, fontStyle: 'italic', color: '#B2BEC3' },

    ribbonCard: { flexDirection: 'row', backgroundColor: '#FFF9C4', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#FDE047' },
    ribbonIcon: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2 },
    ribbonContent: { flex: 1 },
    ribbonTitle: { fontSize: 13, fontWeight: '800', color: '#D97706' },
    ribbonSub: { fontSize: 12, fontWeight: '600', color: '#92400E', marginTop: 2 }
});
