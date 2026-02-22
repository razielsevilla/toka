import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function Leaderboard() {
  const { Colors, Typography } = useTheme();
  const { currentUser, mockUsers } = useTokaStore();
  const sortedUsers = [...mockUsers].sort((a, b) => b.tokens - a.tokens);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <View style={[styles.card, { backgroundColor: Colors.secondary }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="trophy" size={20} color={Colors.white} />
        <Text style={[styles.title, { fontFamily: Typography.heading, color: Colors.white }]}>Household Ranking</Text>
      </View>
      {sortedUsers.slice(0, 3).map((u, index) => (
        <View key={u.id} style={[styles.row, { borderBottomColor: 'rgba(255,255,255,0.15)' }, index < 2 && { borderBottomWidth: 1 }]}>
          <Text style={[styles.rank, { fontFamily: Typography.subheading, color: Colors.white }]}>
            {medals[index]} {u.name.split(' ')[0]} {u.id === currentUser?.id ? '(Me)' : ''}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={[styles.tokens, { fontFamily: Typography.subheading, color: Colors.white }]}>{u.tokens}</Text>
            <Ionicons name="diamond" size={12} color={Colors.white} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15 },
  title: { fontSize: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rank: { fontSize: 15 },
  tokens: { fontSize: 15 },
});