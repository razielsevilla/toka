import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';

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
                    <Ionicons name="person" size={50} color="#6C5CE7" />
                </View>
                <Text style={styles.name}>{activeUser.name}</Text>
                <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{activeUser.role.toUpperCase()}</Text>
                </View>
            </View>

            {/* Household Info */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="home" size={20} color="#2D3436" />
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
                        <Ionicons name="stats-chart" size={20} color="#2D3436" />
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
                            <Ionicons name="star" size={24} color="#FDCB6E" />
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
                        <Ionicons name="shield-checkmark" size={20} color="#2D3436" />
                        <Text style={styles.cardTitle}>My Badges</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {activeUser.badges.map((b, i) => (
                            <View key={i} style={styles.badgePill}>
                                <Ionicons name="medal" size={12} color="#6C5CE7" />
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
    headerBox: { backgroundColor: '#FFF', borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20, elevation: 2 },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F4F1FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    name: { fontSize: 24, fontWeight: '800', color: '#2D3436', marginBottom: 5 },
    roleTag: { backgroundColor: '#6C5CE7', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
    roleText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#2D3436' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
    infoLabel: { fontSize: 14, color: '#636E72', fontWeight: '600' },
    infoValue: { fontSize: 14, color: '#2D3436', fontWeight: '800' },
    inviteBtn: { backgroundColor: '#F4F1FF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
    inviteText: { color: '#6C5CE7', fontWeight: 'bold', fontSize: 14 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    statValue: { fontSize: 16, fontWeight: '800', color: '#2D3436', marginTop: 5 },
    statLabel: { fontSize: 11, fontWeight: '600', color: '#B2BEC3' },
    badgePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F4F1FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: '#6C5CE7' },
});
