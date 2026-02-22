import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';
import { User } from '../../types';

interface Achievement {
    id: string; title: string; description: string; emoji: string;
    condition: (user: User, vaultBalance: number) => boolean;
    rewardTokens: number; badgeName?: string;
}

const ACHIEVEMENTS: Achievement[] = [
    { id: 'ach_level_2', title: 'Level Up!', description: 'Reach Level 2 in the RPG system.', emoji: 'star', condition: (user) => (user.level || 1) >= 2, rewardTokens: 25 },
    { id: 'ach_streak_3', title: 'On Fire!', description: 'Build a 3-day chore streak.', emoji: 'flame', condition: (user) => (user.streak || 0) >= 3, rewardTokens: 50, badgeName: 'Fire Starter' },
    { id: 'ach_vault_50', title: 'Smart Saver', description: 'Household Vault reaches 50 💎.', emoji: 'business', condition: (_, vault) => vault >= 50, rewardTokens: 20, badgeName: 'Banker' },
    { id: 'ach_xp_1000', title: 'Hard Worker', description: 'Accumulate 1,000 Total XP.', emoji: 'barbell', condition: (user) => (user.xp || 0) >= 1000, rewardTokens: 100 },
];

export default function AchievementBoard() {
    const { Colors, Typography } = useTheme();
    const { currentUser, user, vaultBalance, claimAchievement } = useTokaStore();
    const activeUser = currentUser || user;
    const unlocked = activeUser.unlockedAchievements || [];
    const animationRef = useRef<LottieView>(null);

    const handleClaim = (ach: Achievement) => {
        animationRef.current?.play();
        setTimeout(() => { claimAchievement(ach.id, ach.rewardTokens, ach.badgeName); }, 1200);
    };

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.secondary }]}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: 'none', alignItems: 'center', justifyContent: 'center' }}>
                <LottieView ref={animationRef} source={require('../../../assets/lottie/success.json')} loop={false} style={{ width: 250, height: 250 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <Ionicons name="trophy" size={20} color={Colors.secondary} />
                <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.secondary }]}>Achievements</Text>
            </View>
            <Text style={[styles.subtitle, { fontFamily: Typography.body, color: Colors.textDim }]}>Complete milestones to unlock bonus tokens and badges!</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = unlocked.includes(ach.id);
                    const isEligible = ach.condition(activeUser, vaultBalance);
                    return (
                        <View key={ach.id} style={[styles.card, { backgroundColor: Colors.surfaceLight, borderColor: isUnlocked ? Colors.tertiary : Colors.surfaceLight }, isUnlocked && { backgroundColor: Colors.tertiary + '15' }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'flex-start' }}>
                                <Ionicons name={ach.emoji as any} size={24} color={Colors.secondary} style={{ marginBottom: 5 }} />
                                {isUnlocked && <Ionicons name="checkmark-circle" size={16} color={Colors.tertiary} />}
                            </View>
                            <Text style={[styles.title, { fontFamily: Typography.subheading, color: Colors.text }]} numberOfLines={1}>{ach.title}</Text>
                            <Text style={[styles.desc, { fontFamily: Typography.body, color: Colors.textDim }]} numberOfLines={2}>{ach.description}</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 15 }}>
                                <View style={[styles.rewardPill, { backgroundColor: Colors.primary + '20' }]}>
                                    <Ionicons name="gift" size={10} color={Colors.primary} style={{ marginRight: 2 }} />
                                    <Text style={{ fontSize: 10, fontWeight: '800', color: Colors.primary }}>+{ach.rewardTokens} 💎</Text>
                                </View>
                                {ach.badgeName && (
                                    <View style={[styles.rewardPill, { backgroundColor: Colors.primary + '20' }]}>
                                        <Ionicons name="medal" size={10} color={Colors.primary} style={{ marginRight: 2 }} />
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: Colors.primary }}>{ach.badgeName}</Text>
                                    </View>
                                )}
                            </View>
                            {!isUnlocked ? (
                                <TouchableOpacity style={[styles.claimBtn, { backgroundColor: isEligible ? Colors.secondary : Colors.surfaceLight }]} onPress={() => handleClaim(ach)} disabled={!isEligible}>
                                    <Text style={[styles.claimBtnText, { fontFamily: Typography.bodyBold, color: isEligible ? Colors.white : Colors.textDim }]}>{isEligible ? 'Claim Reward!' : 'Locked'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={[styles.claimBtn, { backgroundColor: Colors.tertiary }]}>
                                    <Text style={[styles.claimBtnText, { fontFamily: Typography.bodyBold, color: Colors.white }]}>Claimed ✓</Text>
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
    section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2 },
    sectionTitle: { fontSize: 20 },
    subtitle: { fontSize: 12, marginBottom: 15 },
    card: { width: 200, padding: 15, borderRadius: 15, marginRight: 15, borderWidth: 1 },
    title: { fontSize: 16, marginBottom: 5 },
    desc: { fontSize: 11, marginBottom: 10, height: 30 },
    rewardPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    claimBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    claimBtnText: { fontSize: 12 },
});
