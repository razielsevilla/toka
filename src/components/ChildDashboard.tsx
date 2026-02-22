import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { useTheme } from '../theme/useTheme';

import WishlistHero from './child/WishlistHero';
import TokaBank from './child/TokaBank';
import ChoreBoard from './child/ChoreBoard';
import PeerTransfer from './child/PeerTransfer';
import AchievementBoard from './child/AchievementBoard';
import RpgProfile from './child/RpgProfile';
import Leaderboard from './child/Leaderboard';
import Marketplace from './child/Marketplace';
import MiniGames from './child/MiniGames';
import UserProfile from './UserProfile';

export default function ChildDashboard() {
  const { activeTab, setActiveTab } = useTokaStore();
  const { Colors, Typography } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <UserProfile />;
      case 'home': return (<><WishlistHero /><ChoreBoard /></>);
      case 'economy': return (<><TokaBank /><PeerTransfer /><Marketplace /></>);
      case 'play': return (<><AchievementBoard /><RpgProfile /><MiniGames /><Leaderboard /></>);
    }
  };

  const navItems = [
    { key: 'home', label: 'Earn', icon: 'star-outline' },
    { key: 'economy', label: 'Bank', icon: 'wallet-outline' },
    { key: 'play', label: 'Play', icon: 'game-controller-outline' },
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