import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { Colors, Typography } from '../theme/colors';

// Subcomponents
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

type Tab = 'home' | 'economy' | 'play';

export default function ChildDashboard() {
  const { activeTab, setActiveTab } = useTokaStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'home':
        return (
          <>
            <WishlistHero />
            <ChoreBoard />
          </>
        );
      case 'economy':
        return (
          <>
            <TokaBank />
            <PeerTransfer />
            <Marketplace />
          </>
        );
      case 'play':
        return (
          <>
            <AchievementBoard />
            <RpgProfile />
            <MiniGames />
            <Leaderboard />
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
          <Ionicons name="star-outline" size={22} color={activeTab === 'home' ? Colors.primary : Colors.textDim} style={styles.navIcon} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Earn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'economy' && styles.navItemActive]}
          onPress={() => setActiveTab('economy')}
        >
          <Ionicons name="wallet-outline" size={22} color={activeTab === 'economy' ? Colors.primary : Colors.textDim} style={styles.navIcon} />
          <Text style={[styles.navText, activeTab === 'economy' && styles.navTextActive]}>Bank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'play' && styles.navItemActive]}
          onPress={() => setActiveTab('play')}
        >
          <Ionicons name="game-controller-outline" size={22} color={activeTab === 'play' ? Colors.primary : Colors.textDim} style={styles.navIcon} />
          <Text style={[styles.navText, activeTab === 'play' && styles.navTextActive]}>Play</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    elevation: 20,
    shadowColor: Colors.primary,
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
    backgroundColor: 'rgba(49, 255, 236, 0.1)',
  },
  navIcon: {
    marginBottom: 4,
  },
  navText: {
    fontSize: 11,
    fontFamily: Typography.subheading,
    color: Colors.textDim,
  },
  navTextActive: {
    color: Colors.primary,
  }
});