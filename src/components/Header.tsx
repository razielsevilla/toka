import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import NotificationBoard from './NotificationBoard';
import { Colors, Typography } from '../theme/colors';

export default function Header() {
  const { currentUser, logout, notifications, setActiveTab } = useTokaStore();
  const [showNotifications, setShowNotifications] = useState(false);

  // Failsafe in case it renders before auth catches it
  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.read && (n.targetRole === currentUser.role || n.targetRole === 'all')).length;

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.profileSection} onPress={() => setActiveTab('profile')}>
        <View style={styles.avatarBox}>
          <Ionicons name="person" size={20} color={Colors.background} />
        </View>
        <View>
          <Text style={styles.welcome}>Hello, {currentUser.name.split(' ')[0]}!</Text>
          <Text style={styles.roleTag}>{currentUser.role.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.bellBtn} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
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
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.background, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  welcome: { fontSize: 24, fontFamily: Typography.heading, color: Colors.primary },
  roleTag: { fontSize: 10, fontFamily: Typography.bodyBold, color: Colors.secondary, textTransform: 'uppercase', marginTop: -2 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  bellBtn: { position: 'relative', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 20 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: Colors.danger, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.background },
  badgeText: { color: Colors.text, fontSize: 10, fontFamily: Typography.bodyBold },
  logoutBtn: { backgroundColor: 'transparent', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.danger },
  logoutText: { color: Colors.danger, fontFamily: Typography.subheading, fontSize: 12 }
});