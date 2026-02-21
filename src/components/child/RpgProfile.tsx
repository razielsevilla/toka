import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function RpgProfile() {
    const { currentUser, user } = useTokaStore();
    const activeUser = currentUser || user;

    const xp = activeUser.xp || 0;
    const level = activeUser.level || 1;
    const badges = activeUser.badges || ['Seedling'];

    const xpNeeded = level * 500;
    const currentLevelXp = xp % 500;
    const progress = currentLevelXp / 500;

    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>🛡️ RPG Profile</Text>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>Lv. {level}</Text>
                </View>
            </View>

            <Text style={styles.xpText}>{xp} Total XP</Text>
            <View style={styles.xpBarBg}>
                <View style={[styles.xpBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.xpSubtext}>{currentLevelXp} / 500 XP to Level {level + 1}</Text>

            <Text style={styles.badgesTitle}>🏆 Badges Earned</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesWrapper}>
                {badges.map((b, i) => (
                    <View key={i} style={styles.badgeCard}>
                        <Text style={styles.badgeIcon}>{getBadgeIcon(b)}</Text>
                        <Text style={styles.badgeName}>{b}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

function getBadgeIcon(badge: string) {
    if (badge === 'Seedling') return '🌱';
    if (badge === 'First Chore!') return '🎉';
    if (badge === 'Rising Star') return '⭐';
    if (badge === 'Chore Master') return '👑';
    return '🏅';
}

const styles = StyleSheet.create({
    section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2D3436' },
    levelBadge: { backgroundColor: '#6C5CE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    levelText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
    xpText: { fontSize: 16, fontWeight: '800', color: '#6C5CE7', marginTop: 15 },
    xpBarBg: { height: 10, backgroundColor: '#F1F2F6', borderRadius: 5, overflow: 'hidden', marginVertical: 8 },
    xpBarFill: { height: '100%', backgroundColor: '#00B894', borderRadius: 5 },
    xpSubtext: { fontSize: 11, color: '#B2BEC3', fontWeight: '700', textAlign: 'right', marginBottom: 20 },
    badgesTitle: { fontSize: 14, fontWeight: '800', color: '#2D3436', marginBottom: 10 },
    badgesWrapper: { flexDirection: 'row' },
    badgeCard: { backgroundColor: '#FDCB6E', padding: 15, borderRadius: 15, marginRight: 10, alignItems: 'center', minWidth: 85, elevation: 2 },
    badgeIcon: { fontSize: 26, marginBottom: 5 },
    badgeName: { fontSize: 11, fontWeight: '900', color: '#D35400', textAlign: 'center' },
});
