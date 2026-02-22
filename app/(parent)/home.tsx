import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import MarketAlerts from '../../src/components/parent/MarketAlerts';
import ChildTracker from '../../src/components/parent/ChildTracker';
import BudgetOverview from '../../src/components/parent/BudgetOverview';
import AnalyticsReport from '../../src/components/parent/AnalyticsReport';

export default function ParentHome() {
    const { Colors } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: Colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <MarketAlerts />
            <ChildTracker />
            <BudgetOverview />
            <AnalyticsReport />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
