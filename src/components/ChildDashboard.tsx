import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

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

export default function ChildDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* We start with the goal for motivation */}
        <WishlistHero />

        {/* Banking features */}
        <TokaBank />

        {/* The core gameplay/work loop */}
        <ChoreBoard />

        {/* Peer-to-Peer Transactions */}
        <PeerTransfer />

        {/* Gamified Objectives */}
        <AchievementBoard />

        {/* Leveling & Badges system */}
        <RpgProfile />

        {/* Social competition */}
        <Leaderboard />

        {/* Fun minigames */}
        <MiniGames />

        {/* The spending/rewards shop */}
        <Marketplace />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
});