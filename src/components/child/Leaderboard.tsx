import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';

export default function Leaderboard() {
  const { currentUser, mockUsers } = useTokaStore();
  const sortedUsers = [...mockUsers].sort((a, b) => b.tokens - a.tokens);

  return (
    <View style={styles.leaderboardCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Ionicons name="trophy" size={20} color="#FFF" />
        <Text style={[styles.sectionTitleWhite, { marginBottom: 0 }]}>Household Ranking</Text>
      </View>
      {sortedUsers.slice(0, 3).map((u, index) => (
        <View key={u.id} style={styles.leaderRow}>
          <Text style={styles.rankText}>
            {index + 1}. {u.name.split(' ')[0]} {u.id === currentUser?.id ? '(Me)' : ''}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.rankTokens}>{u.tokens}</Text>
            <Ionicons name="diamond" size={12} color="#D35400" />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  leaderboardCard: { backgroundColor: '#FDCB6E', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15 },
  sectionTitleWhite: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 10 },
  leaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rankText: { fontWeight: 'bold', color: '#2D3436' },
  rankTokens: { fontWeight: 'bold', color: '#D35400' },
});