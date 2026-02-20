import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function Leaderboard() {
  const { currentUser, mockUsers } = useTokaStore();
  const sortedUsers = [...mockUsers].sort((a, b) => b.tokens - a.tokens);

  return (
    <View style={styles.leaderboardCard}>
      <Text style={styles.sectionTitleWhite}>🏆 Household Ranking</Text>
      {sortedUsers.slice(0, 3).map((u, index) => (
        <View key={u.id} style={styles.leaderRow}>
          <Text style={styles.rankText}>
            {index + 1}. {u.name.split(' ')[0]} {u.id === currentUser?.id ? '(Me)' : ''}
          </Text>
          <Text style={styles.rankTokens}>{u.tokens} 💎</Text>
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