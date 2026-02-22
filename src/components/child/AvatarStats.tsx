import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function AvatarStats() {
    const { Colors, Typography } = useTheme();
    const { currentUser } = useTokaStore();

    if (!currentUser) return null;

    const currentXp = currentUser.xp || 0;
    const currentLevel = currentUser.level || 1;
    const nextLevelXp = currentLevel * 500;
    const xpPercent = Math.min((currentXp / nextLevelXp) * 100, 100);

    const getRankName = (lvl: number) => {
        if (lvl < 2) return "Novice";
        if (lvl < 5) return "Apprentice";
        if (lvl < 10) return "Journeyman";
        return "Master";
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={styles.headerRow}>
                <View style={styles.rankInfo}>
                    <View style={[styles.levelBadge, { backgroundColor: Colors.tertiary }]}>
                        <Text style={{ fontFamily: Typography.heading, color: Colors.white, fontSize: 16 }}>Lvl {currentLevel}</Text>
                    </View>
                    <Text style={{ fontFamily: Typography.subheading, color: Colors.text, fontSize: 18 }}>{getRankName(currentLevel)}</Text>
                </View>

                <View style={styles.streakInfo}>
                    <Ionicons name="flame" size={20} color="#E17055" />
                    <Text style={{ fontFamily: Typography.heading, color: '#E17055', fontSize: 18 }}>{currentUser.streak} Day Tracker</Text>
                </View>
            </View>

            <View style={styles.xpBox}>
                <View style={styles.xpLabelsRow}>
                    <Text style={{ fontFamily: Typography.bodyBold, color: Colors.textDim, fontSize: 12 }}>XP to Next Level</Text>
                    <Text style={{ fontFamily: Typography.bodyBold, color: Colors.tertiary, fontSize: 12 }}>{currentXp} / {nextLevelXp}</Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: Colors.surfaceLight }]}>
                    <View style={[styles.progressFill, { width: `${Math.min(xpPercent, 100)}%` as any, backgroundColor: Colors.tertiary }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, borderWidth: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    rankInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    levelBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    streakInfo: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(225, 112, 85, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    xpBox: { marginTop: 5 },
    xpLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    progressBar: { height: 12, borderRadius: 6, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 6 },
});
