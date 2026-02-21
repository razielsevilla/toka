import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
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
        emoji: 'star',
        condition: (user) => (user.level || 1) >= 2,
        rewardTokens: 25,
    },
    {
        id: 'ach_streak_3',
        title: 'On Fire!',
        description: 'Build a 3-day chore streak.',
        emoji: 'flame',
        condition: (user) => (user.streak || 0) >= 3,
        rewardTokens: 50,
        badgeName: 'Fire Starter',
    },
    {
        id: 'ach_vault_50',
        title: 'Smart Saver',
        description: 'Household Vault reaches 50 💎.',
        emoji: 'business',
        condition: (_, vault) => vault >= 50,
        rewardTokens: 20,
        badgeName: 'Banker',
    },
    {
        id: 'ach_xp_1000',
        title: 'Hard Worker',
        description: 'Accumulate 1,000 Total XP.',
        emoji: 'barbell',
        condition: (user) => (user.xp || 0) >= 1000,
        rewardTokens: 100,
    }
];

export default function AchievementBoard() {
    const { currentUser, user, vaultBalance, claimAchievement } = useTokaStore();
    const activeUser = currentUser || user;
    const unlocked = activeUser.unlockedAchievements || [];
    const animationRef = useRef<LottieView>(null);

    const handleClaim = (ach: Achievement) => {
        animationRef.current?.play();
        setTimeout(() => {
            claimAchievement(ach.id, ach.rewardTokens, ach.badgeName);
        }, 1200);
    };

    return (
        <View style={styles.section}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: 'none', alignItems: 'center', justifyContent: 'center' }}>
                <LottieView
                    ref={animationRef}
                    source={require('../../../assets/lottie/success.json')}
                    loop={false}
                    style={{ width: 250, height: 250 }}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <Ionicons name="trophy" size={20} color="#D35400" />
                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Achievement Board</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Complete milestones to unlock bonus tokens and badges!</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
                {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = unlocked.includes(ach.id);
                    const isEligible = ach.condition(activeUser, vaultBalance);

                    return (
                        <View key={ach.id} style={[styles.card, isUnlocked && styles.cardUnlocked]}>
                            <View style={styles.cardHeader}>
                                <Ionicons name={ach.emoji as any} size={24} color="#FDCB6E" style={styles.iconStyle} />
                                {isUnlocked && <Ionicons name="checkmark-circle" size={16} color="#00B894" />}
                            </View>

                            <Text style={styles.title} numberOfLines={1}>{ach.title}</Text>
                            <Text style={styles.desc} numberOfLines={2}>{ach.description}</Text>

                            <View style={styles.rewardRow}>
                                <View style={styles.rewardPillsContainer}>
                                    <View style={styles.rewardTextPill}>
                                        <Ionicons name="gift" size={10} color="#0984E3" style={{ marginRight: 2 }} />
                                        <Text style={styles.rewardTextInner}>+{ach.rewardTokens} </Text>
                                        <Ionicons name="diamond" size={10} color="#0984E3" />
                                    </View>
                                    {ach.badgeName && (
                                        <View style={styles.rewardTextPill}>
                                            <Ionicons name="medal" size={10} color="#0984E3" style={{ marginRight: 2 }} />
                                            <Text style={styles.rewardTextInner}>{ach.badgeName}</Text>
                                        </View>
                                    )}
                                </View>
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
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'flex-start' },
    iconStyle: { marginBottom: 5 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 5 },
    desc: { fontSize: 11, color: '#636E72', marginBottom: 10, height: 30 },
    rewardRow: { marginBottom: 15 },
    rewardPillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    rewardTextPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
    rewardTextInner: { fontSize: 10, fontWeight: '800', color: '#0984E3' },
    claimBtn: { backgroundColor: '#FDCB6E', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    claimBtnDisabled: { backgroundColor: '#DFE6E9' },
    claimBtnText: { color: '#2D3436', fontWeight: 'bold', fontSize: 12 },
    claimedBtn: { backgroundColor: '#00B894', paddingVertical: 10, borderRadius: 10, alignItems: 'center', opacity: 0.8 },
    claimedBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});
