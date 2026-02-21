import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

// Subcomponents
import MarketAlerts from './parent/MarketAlerts';
import ChildTracker from './parent/ChildTracker';
import ApprovalQueue from './parent/ApprovalQueue';
import TaskCreator from './parent/TaskCreator';
import MarketManager from './parent/MarketManager';
import BankingPolicy from './parent/BankingPolicy'; // <-- New Policy Component

export default function ParentDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. Notifications & Alerts */}
        <MarketAlerts />

        {/* 2. Oversight: How the kids are doing */}
        <ChildTracker />

        {/* 3. Action Center: Approving work & withdrawals */}
        <ApprovalQueue />

        {/* 4. Household Rules: Banking & Interest Policies */}
        <BankingPolicy />

        {/* 5. Management: Creating work & rewards */}
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