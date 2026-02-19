import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ProgressBarAndroid } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function ChildDashboard() {
  const { user, tasks, marketItems } = useTokaStore();
  
  const myTasks = tasks.filter(t => t.status === 'open' || t.status === 'accepted');
  const wishlistGoal = marketItems[1]; // Simulate "Pizza Night" as the goal

  return (
    <ScrollView style={styles.container}>
      {/* 1. LEADERBOARD TEASER */}
      <View style={[styles.section, {backgroundColor: '#FFD700'}]}>
        <Text style={styles.subTitle}>🏆 Household Leaderboard</Text>
        <Text style={styles.label}>1. Raziel (🔥 {user.streak} Days)</Text>
        <Text style={styles.label}>2. Sibling (🔥 3 Days)</Text>
      </View>

      {/* 2. WISHLIST PROGRESS */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>🎯 Wishlist: {wishlistGoal.name}</Text>
        <Text style={styles.label}>{user.tokens} / {wishlistGoal.cost} Tokens</Text>
        <View style={styles.progressBar} /> {/* Logic: width would be (tokens/cost)% */}
        <Text style={styles.goalText}>You need {wishlistGoal.cost - user.tokens} more tokens!</Text>
      </View>

      {/* 3. TASK POOL */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Available Chores</Text>
        {myTasks.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskReward}>💎 {task.reward}</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Snap-to-Verify</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 4. AUCTION TEASER */}
      <View style={[styles.section, {backgroundColor: '#2D3436'}]}>
        <Text style={[styles.subTitle, {color: '#FFF'}]}>⌛ Auction Ending Soon!</Text>
        <Text style={{color: '#FDCB6E'}}>End of month prize: Family Trip! Save up!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  label: { fontSize: 14, fontWeight: '600' },
  progressBar: { height: 10, backgroundColor: '#00B894', width: '75%', borderRadius: 5, marginVertical: 10 },
  goalText: { fontSize: 11, fontStyle: 'italic', color: '#636E72' },
  taskCard: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  taskReward: { color: '#0984E3', marginBottom: 10 },
  actionButton: { backgroundColor: '#6C5CE7', padding: 8, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' }
});