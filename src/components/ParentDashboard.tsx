import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { useTheme } from '../theme/useTheme';

import MarketAlerts from './parent/MarketAlerts';
import BudgetOverview from './parent/BudgetOverview';
import AnalyticsReport from './parent/AnalyticsReport';
import ChildTracker from './parent/ChildTracker';
import ApprovalQueue from './parent/ApprovalQueue';
import TaskCreator from './parent/TaskCreator';
import MarketManager from './parent/MarketManager';
import BankingPolicy from './parent/BankingPolicy';
import RecurringBills from './parent/RecurringBills';
import UserProfile from './UserProfile';

export default function ParentDashboard() {
  const { activeTab, setActiveTab } = useTokaStore();
  const { Colors, Typography } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <UserProfile />;
      case 'home': return (<><MarketAlerts /><ChildTracker /><BudgetOverview /><AnalyticsReport /></>);
      case 'review': return <ApprovalQueue />;
      case 'manage': return (<><TaskCreator /><MarketManager /><BankingPolicy /><RecurringBills /></>);
    }
  };

  const navItems = [
    { key: 'home', label: 'Home', icon: 'home-outline' },
    { key: 'review', label: 'Review', icon: 'checkmark-circle-outline' },
    { key: 'manage', label: 'Manage', icon: 'settings-outline' },
  ] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
      <View style={[styles.bottomNav, { backgroundColor: Colors.surface, borderTopColor: Colors.surfaceLight, shadowColor: Colors.primary }]}>
        {navItems.map(({ key, label, icon }) => {
          const active = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.navItem, active && { backgroundColor: Colors.primary + '18' }]}
              onPress={() => setActiveTab(key)}
            >
              <Ionicons name={icon} size={22} color={active ? Colors.primary : Colors.textDim} style={styles.navIcon} />
              <Text style={[styles.navText, { fontFamily: Typography.subheading, color: active ? Colors.primary : Colors.textDim }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20, paddingTop: 10 },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around', elevation: 20, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 10 },
  navItem: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  navIcon: { marginBottom: 4 },
  navText: { fontSize: 11 },
});