import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

// Subcomponents
import MarketAlerts from './parent/MarketAlerts';
import ChildTracker from './parent/ChildTracker';
import ApprovalQueue from './parent/ApprovalQueue';
import TaskCreator from './parent/TaskCreator';
import MarketManager from './parent/MarketManager';

export default function ParentDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        <MarketAlerts />
        <ChildTracker />
        <ApprovalQueue />
        <TaskCreator />
        <MarketManager />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
});