import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import AchievementBoard from '../../src/components/child/AchievementBoard';
import RpgProfile from '../../src/components/child/RpgProfile';
import MiniGames from '../../src/components/child/MiniGames';
import Leaderboard from '../../src/components/child/Leaderboard';

export default function ChildPlay() {
    const { Colors } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: Colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <AchievementBoard />
            <RpgProfile />
            <MiniGames />
            <Leaderboard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
