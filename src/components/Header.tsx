import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import NotificationBoard from './NotificationBoard';

export default function Header() {
  const { currentUser, logout, notifications } = useTokaStore();
  const [showNotifications, setShowNotifications] = useState(false);

  // Failsafe in case it renders before auth catches it
  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.read && (n.targetRole === currentUser.role || n.targetRole === 'all')).length;

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.welcome}>Hello, {currentUser.name.split(' ')[0]}!</Text>
        <Text style={styles.roleTag}>{currentUser.role.toUpperCase()}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.bellBtn} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={24} color="#2D3436" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <NotificationBoard
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 50, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  roleTag: { fontSize: 10, color: '#6C5CE7', fontWeight: 'bold' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  bellBtn: { position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#D63031', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#F1F2F6', padding: 8, borderRadius: 8 },
  logoutText: { color: '#D63031', fontWeight: 'bold', fontSize: 12 }
});