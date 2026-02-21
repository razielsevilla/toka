import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';
import { User } from '../../types';

interface Achievement {
    id: string;
    title: string;
    description: string;
    emoji: string;
    condition: (user: User, vaultBalance: number) => boolean;
    rewardTokens: number;
    badgeName?: string;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'ach_level_2',
        title: 'Level Up!',
        description: 'Reach Level 2 in the RPG system.',
        emoji: '⭐',
        condition: (user) => (user.level || 1) >= 2,
        rewardTokens: 25,
    },
    {
        id: 'ach_streak_3',
        title: 'On Fire!',
        description: 'Build a 3-day chore streak.',
        emoji: '🔥',
        condition: (user) => (user.streak || 0) >= 3,
        rewardTokens: 50,
        badgeName: 'Fire Starter',
    },
    {
        id: 'ach_vault_50',
        title: 'Smart Saver',
        description: 'Household Vault reaches 50 💎.',
        emoji: '🏦',
        condition: (_, vault) => vault >= 50,
        rewardTokens: 20,
        badgeName: 'Banker',
    },
    {
        id: 'ach_xp_1000',
        title: 'Hard Worker',
        description: 'Accumulate 1,000 Total XP.',
        emoji: '💪',
        condition: (user) => (user.xp || 0) >= 1000,
        rewardTokens: 100,
    }
];

export default function AchievementBoard() {
    const { currentUser, user, vaultBalance, claimAchievement } = useTokaStore();
    const activeUser = currentUser || user;
    const unlocked = activeUser.unlockedAchievements || [];

    const handleClaim = (ach: Achievement) => {
        claimAchievement(ach.id, ach.rewardTokens, ach.badgeName);
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Achievement Board</Text>
            <Text style={styles.sectionSubtitle}>Complete milestones to unlock bonus tokens and badges!</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
                {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = unlocked.includes(ach.id);
                    const isEligible = ach.condition(activeUser, vaultBalance);

                    return (
                        <View key={ach.id} style={[styles.card, isUnlocked && styles.cardUnlocked]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.emoji}>{ach.emoji}</Text>
                                {isUnlocked && <Text style={styles.check}>✅</Text>}
                            </View>

                            <Text style={styles.title} numberOfLines={1}>{ach.title}</Text>
                            <Text style={styles.desc} numberOfLines={2}>{ach.description}</Text>

                            <View style={styles.rewardRow}>
                                <Text style={styles.rewardText}>🎁 +{ach.rewardTokens} 💎</Text>
                                {ach.badgeName && <Text style={styles.rewardText}>🏅 {ach.badgeName}</Text>}
                            </View>

                            {!isUnlocked ? (
                                <TouchableOpacity
                                    style={[styles.claimBtn, !isEligible && styles.claimBtnDisabled]}
                                    onPress={() => handleClaim(ach)}
                                    disabled={!isEligible}
                                >
                                    <Text style={styles.claimBtnText}>{isEligible ? 'Claim Reward!' : 'Locked'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.claimedBtn}>
                                    <Text style={styles.claimedBtnText}>Claimed</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2, borderColor: '#FDCB6E' },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#D35400', marginBottom: 5 },
    sectionSubtitle: { fontSize: 12, color: '#636E72', marginBottom: 15 },
    scroller: { flexDirection: 'row' },
    card: { backgroundColor: '#F8F9FA', width: 200, padding: 15, borderRadius: 15, marginRight: 15, borderWidth: 1, borderColor: '#EEE' },
    cardUnlocked: { borderColor: '#00B894', backgroundColor: '#E6FCF5' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    emoji: { fontSize: 24 },
    check: { fontSize: 16 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 5 },
    desc: { fontSize: 11, color: '#636E72', marginBottom: 10, height: 30 },
    rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 15 },
    rewardText: { fontSize: 10, fontWeight: '800', backgroundColor: '#FFF', color: '#0984E3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
    claimBtn: { backgroundColor: '#FDCB6E', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    claimBtnDisabled: { backgroundColor: '#DFE6E9' },
    claimBtnText: { color: '#2D3436', fontWeight: 'bold', fontSize: 12 },
    claimedBtn: { backgroundColor: '#00B894', paddingVertical: 10, borderRadius: 10, alignItems: 'center', opacity: 0.8 },
    claimedBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});
