import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { useTheme } from '../theme/useTheme';

export default function UserProfile() {
    const { currentUser, user, logout } = useTokaStore();
    const { Colors, Typography } = useTheme();
    const activeUser = currentUser || user;
    if (!activeUser) return null;
    const isAdmin = activeUser.role === 'admin';

    return (
        <View style={{ padding: 20 }}>
            {/* Profile Header */}
            <View style={[styles.headerBox, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
                <View style={[styles.avatarCircle, { backgroundColor: Colors.primary }]}>
                    <Ionicons name="person" size={50} color={Colors.white} />
                </View>
                <Text style={[styles.name, { fontFamily: Typography.heading, color: Colors.primary }]}>{activeUser.name}</Text>
                <View style={[styles.roleTag, { backgroundColor: Colors.secondary }]}>
                    <Text style={[styles.roleText, { fontFamily: Typography.bodyBold, color: Colors.white }]}>{activeUser.role.toUpperCase()}</Text>
                </View>
            </View>

            {/* Household Info */}
            <View style={[styles.card, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="home" size={20} color={Colors.primary} />
                    <Text style={[styles.cardTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Household Details</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomColor: Colors.surfaceLight }]}>
                    <Text style={[styles.infoLabel, { fontFamily: Typography.subheading, color: Colors.textDim }]}>Household ID:</Text>
                    <Text style={[styles.infoValue, { fontFamily: Typography.subheading, color: Colors.text }]}>{activeUser.householdId || 'Not Joined'}</Text>
                </View>
                {isAdmin && (
                    <TouchableOpacity style={[styles.inviteBtn, { backgroundColor: Colors.primary + '15', borderColor: Colors.primary }]} onPress={() => Alert.alert('Invite Code', 'House Invite Code: 8XF2D')}>
                        <Text style={[styles.inviteText, { fontFamily: Typography.subheading, color: Colors.primary }]}>Generate Invite Code</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Stats (members only) */}
            {!isAdmin && (
                <View style={[styles.card, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="stats-chart" size={20} color={Colors.primary} />
                        <Text style={[styles.cardTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>My Progress</Text>
                    </View>
                    <View style={styles.statsGrid}>
                        {[
                            { icon: 'diamond', color: Colors.primary, value: activeUser.tokens, label: 'Tokens' },
                            { icon: 'flame', color: '#E17055', value: `${activeUser.streak}d`, label: 'Streak' },
                            { icon: 'star', color: Colors.secondary, value: `Lv ${activeUser.level || 1}`, label: `XP: ${activeUser.xp || 0}` },
                        ].map(s => (
                            <View key={s.label} style={[styles.statBox, { backgroundColor: Colors.surfaceLight }]}>
                                <Ionicons name={s.icon as any} size={24} color={s.color} />
                                <Text style={[styles.statValue, { fontFamily: Typography.subheading, color: Colors.text }]}>{s.value}</Text>
                                <Text style={[styles.statLabel, { fontFamily: Typography.bodyMedium, color: Colors.textDim }]}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Badges */}
            {!isAdmin && activeUser.badges && activeUser.badges.length > 0 && (
                <View style={[styles.card, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
                        <Text style={[styles.cardTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>My Badges</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {activeUser.badges.map((b, i) => (
                            <View key={i} style={[styles.badgePill, { backgroundColor: Colors.primary }]}>
                                <Ionicons name="medal" size={12} color={Colors.white} />
                                <Text style={[styles.badgeText, { fontFamily: Typography.bodyBold, color: Colors.white }]}>{b}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Sign Out */}
            <TouchableOpacity
                style={[styles.signOutBtn, { borderColor: Colors.danger }]}
                onPress={() =>
                    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign Out', style: 'destructive', onPress: logout },
                    ])
                }
            >
                <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
                <Text style={[styles.signOutText, { color: Colors.danger, fontFamily: Typography.subheading }]}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerBox: { borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20, elevation: 2, borderWidth: 1 },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    name: { fontSize: 28, marginBottom: 5 },
    roleTag: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
    roleText: { fontSize: 12 },
    card: { borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    cardTitle: { fontSize: 20, marginTop: 4 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 14 },
    inviteBtn: { borderWidth: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
    inviteText: { fontSize: 14 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { padding: 15, borderRadius: 15, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    statValue: { fontSize: 18, marginTop: 5 },
    statLabel: { fontSize: 11 },
    badgePill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
    badgeText: { fontSize: 12 },
    signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1.5, marginTop: 5 },
    signOutText: { fontSize: 16 },
});
