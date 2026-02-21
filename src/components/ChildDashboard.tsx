import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';

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

type Tab = 'home' | 'economy' | 'play';

export default function ChildDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
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
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Earn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'economy' && styles.navItemActive]}
          onPress={() => setActiveTab('economy')}
        >
          <Text style={styles.navIcon}>🏦</Text>
          <Text style={[styles.navText, activeTab === 'economy' && styles.navTextActive]}>Bank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'play' && styles.navItemActive]}
          onPress={() => setActiveTab('play')}
        >
          <Text style={styles.navIcon}>🎮</Text>
          <Text style={[styles.navText, activeTab === 'play' && styles.navTextActive]}>Play</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD'
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
    fontSize: 22,
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