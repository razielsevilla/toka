import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import TaskCreator from '../../src/components/parent/TaskCreator';
import MarketManager from '../../src/components/parent/MarketManager';
import BankingPolicy from '../../src/components/parent/BankingPolicy';
import RecurringBills from '../../src/components/parent/RecurringBills';

export default function ParentManage() {
    const { Colors } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: Colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <TaskCreator />
            <MarketManager />
            <BankingPolicy />
            <RecurringBills />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
