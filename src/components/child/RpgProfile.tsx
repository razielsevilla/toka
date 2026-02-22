import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

function getBadgeIcon(badge: string, primaryColor: string) {
    if (badge === 'Seedling') return <Ionicons name="leaf" size={24} color="#10B981" />;
    if (badge === 'First Chore!') return <Ionicons name="gift" size={24} color="#E17055" />;
    if (badge === 'Rising Star') return <Ionicons name="star" size={24} color="#FBBF24" />;
    if (badge === 'Chore Master') return <Ionicons name="medal" size={24} color={primaryColor} />;
    return <Ionicons name="ribbon" size={24} color="#F43F5E" />;
}

export default function RpgProfile() {
    const { Colors, Typography } = useTheme();
    const { currentUser, user } = useTokaStore();
    const activeUser = currentUser || user;
    const xp = activeUser.xp || 0;
    const level = activeUser.level || 1;
    const badges = activeUser.badges || ['Seedling'];
    const currentLevelXp = xp % 500;
    const progress = currentLevelXp / 500;

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
                    <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>RPG Profile</Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: Colors.primary }]}>
                    <Text style={[styles.levelText, { color: Colors.white, fontFamily: Typography.subheading }]}>Lv. {level}</Text>
                </View>
            </View>

            <Text style={[styles.xpText, { fontFamily: Typography.subheading, color: Colors.primary }]}>{xp} Total XP</Text>
            <View style={[styles.xpBarBg, { backgroundColor: Colors.surfaceLight }]}>
                <View style={[styles.xpBarFill, { width: `${progress * 100}%` as any, backgroundColor: Colors.tertiary }]} />
            </View>
            <Text style={[styles.xpSubtext, { fontFamily: Typography.bodyBold, color: Colors.textDim }]}>{currentLevelXp} / 500 XP to Level {level + 1}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Ionicons name="trophy" size={16} color={Colors.secondary} />
                <Text style={[styles.badgesTitle, { fontFamily: Typography.subheading, color: Colors.text }]}>Badges Earned</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {badges.map((b, i) => (
                    <View key={i} style={[styles.badgeCard, { backgroundColor: Colors.secondary }]}>
                        <View style={[styles.badgeIconBg, { backgroundColor: 'rgba(255,255,255,0.85)' }]}>
                            {getBadgeIcon(b, Colors.primary)}
                        </View>
                        <Text style={[styles.badgeName, { fontFamily: Typography.bodyBold, color: Colors.white }]}>{b}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 1 },
    sectionTitle: { fontSize: 20 },
    levelBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    levelText: { fontSize: 14 },
    xpText: { fontSize: 16, marginTop: 5 },
    xpBarBg: { height: 10, borderRadius: 5, overflow: 'hidden', marginVertical: 8 },
    xpBarFill: { height: '100%', borderRadius: 5 },
    xpSubtext: { fontSize: 11, textAlign: 'right', marginBottom: 20 },
    badgesTitle: { fontSize: 14, marginBottom: 10 },
    badgeCard: { padding: 15, borderRadius: 15, marginRight: 10, alignItems: 'center', minWidth: 85, elevation: 2 },
    badgeIconBg: { marginBottom: 8, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    badgeName: { fontSize: 11, textAlign: 'center' },
});
