import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import MarketAlerts from './parent/MarketAlerts';
import BudgetOverview from './parent/BudgetOverview';
import AnalyticsReport from './parent/AnalyticsReport';
import ChildTracker from './parent/ChildTracker';
import ApprovalQueue from './parent/ApprovalQueue';
import TaskCreator from './parent/TaskCreator';
import MarketManager from './parent/MarketManager';
import BankingPolicy from './parent/BankingPolicy';
import RecurringBills from './parent/RecurringBills';

export default function ParentDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. Notifications & Alerts */}
        <MarketAlerts />

        {/* 2. Economy Oversight */}
        <BudgetOverview />

        <AnalyticsReport />

        {/* 4. Child Progress Tracker */}
        <ChildTracker />

        {/* 5. Action Center: Approving work & withdrawals */}
        <ApprovalQueue />

        {/* 6. Household Rules: Banking & Interest Policies */}
        <BankingPolicy />

        {/* 7. Deductions & Taxes */}
        <RecurringBills />

        {/* 8. Management: Creating work & rewards */}
        <TaskCreator />
        <MarketManager />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5'
  },
  scrollContent: {
    paddingBottom: 40
  }
});