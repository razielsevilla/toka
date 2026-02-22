import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { Colors, Typography } from '../theme/colors';

export default function UserProfile() {
    const { currentUser, user } = useTokaStore();
    const activeUser = currentUser || user;

    if (!activeUser) return null;

    const isAdmin = activeUser.role === 'admin';

    return (
        <View style={styles.container}>
            {/* Profile Header */}
            <View style={styles.headerBox}>
                <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={50} color={Colors.background} />
                </View>
                <Text style={styles.name}>{activeUser.name}</Text>
                <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{activeUser.role.toUpperCase()}</Text>
                </View>
            </View>

            {/* Household Info */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="home" size={20} color={Colors.text} />
                    <Text style={styles.cardTitle}>Household Details</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Household ID:</Text>
                    <Text style={styles.infoValue}>{activeUser.householdId || 'Not Joined'}</Text>
                </View>
                {isAdmin && (
                    <TouchableOpacity style={styles.inviteBtn} onPress={() => Alert.alert("Invite Code", "House Invite Code: 8XF2D")}>
                        <Text style={styles.inviteText}>Generate Invite Code</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Stats (for members) */}
            {!isAdmin && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="stats-chart" size={20} color={Colors.text} />
                        <Text style={styles.cardTitle}>My Progress</Text>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Ionicons name="diamond" size={24} color="#0984E3" />
                            <Text style={styles.statValue}>{activeUser.tokens}</Text>
                            <Text style={styles.statLabel}>Tokens</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Ionicons name="flame" size={24} color="#E17055" />
                            <Text style={styles.statValue}>{activeUser.streak} Days</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Ionicons name="star" size={24} color={Colors.secondary} />
                            <Text style={styles.statValue}>Lvl {activeUser.level || 1}</Text>
                            <Text style={styles.statLabel}>XP: {activeUser.xp || 0}</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Badges */}
            {!isAdmin && activeUser.badges && activeUser.badges.length > 0 && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="shield-checkmark" size={20} color={Colors.text} />
                        <Text style={styles.cardTitle}>My Badges</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {activeUser.badges.map((b, i) => (
                            <View key={i} style={styles.badgePill}>
                                <Ionicons name="medal" size={12} color={Colors.background} />
                                <Text style={styles.badgeText}>{b}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    headerBox: { backgroundColor: Colors.surface, borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: Colors.surfaceLight },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    name: { fontSize: 28, fontFamily: Typography.heading, color: Colors.primary, marginBottom: 5 },
    roleTag: { backgroundColor: Colors.secondary, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
    roleText: { color: Colors.background, fontFamily: Typography.bodyBold, fontSize: 12 },
    card: { backgroundColor: Colors.surface, borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: Colors.surfaceLight },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    cardTitle: { fontSize: 20, fontFamily: Typography.heading, color: Colors.primary, marginTop: 4 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.surfaceLight },
    infoLabel: { fontSize: 14, color: Colors.textDim, fontFamily: Typography.subheading },
    infoValue: { fontSize: 14, color: Colors.text, fontFamily: Typography.subheading },
    inviteBtn: { backgroundColor: 'rgba(49, 255, 236, 0.1)', borderWidth: 1, borderColor: Colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
    inviteText: { color: Colors.primary, fontFamily: Typography.subheading, fontSize: 14 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { backgroundColor: Colors.surfaceLight, padding: 15, borderRadius: 15, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    statValue: { fontSize: 18, fontFamily: Typography.subheading, color: Colors.text, marginTop: 5 },
    statLabel: { fontSize: 11, fontFamily: Typography.bodyMedium, color: Colors.textDim },
    badgePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
    badgeText: { fontSize: 12, fontFamily: Typography.bodyBold, color: Colors.background },
});
