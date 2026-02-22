import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';

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

type Tab = 'home' | 'review' | 'manage';

export default function ParentDashboard() {
  const { activeTab, setActiveTab } = useTokaStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'home':
        return (
          <>
            <MarketAlerts />
            <ChildTracker />
            <BudgetOverview />
            <AnalyticsReport />
          </>
        );
      case 'review':
        return (
          <>
            <ApprovalQueue />
          </>
        );
      case 'manage':
        return (
          <>
            <TaskCreator />
            <MarketManager />
            <BankingPolicy />
            <RecurringBills />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="home-outline" size={22} color={activeTab === 'home' ? '#6C5CE7' : '#A0AEC0'} style={styles.navIcon} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'review' && styles.navItemActive]}
          onPress={() => setActiveTab('review')}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={activeTab === 'review' ? '#6C5CE7' : '#A0AEC0'} style={styles.navIcon} />
          <Text style={[styles.navText, activeTab === 'review' && styles.navTextActive]}>Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'manage' && styles.navItemActive]}
          onPress={() => setActiveTab('manage')}
        >
          <Ionicons name="settings-outline" size={22} color={activeTab === 'manage' ? '#6C5CE7' : '#A0AEC0'} style={styles.navIcon} />
          <Text style={[styles.navText, activeTab === 'manage' && styles.navTextActive]}>Manage</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5'
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: '#F4F1FF',
  },
  navIcon: {
    marginBottom: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A0AEC0',
  },
  navTextActive: {
    color: '#6C5CE7',
  }
});