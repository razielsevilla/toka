import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import NotificationBoard from './NotificationBoard';
import { useTheme } from '../theme/useTheme';

export default function Header() {
  const { currentUser, notifications, setActiveTab, setTheme } = useTokaStore();
  const { Colors, Typography, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.read && (n.targetRole === currentUser.role || n.targetRole === 'all')).length;

  return (
    <View style={[styles.header, { backgroundColor: Colors.background, borderBottomColor: Colors.surfaceLight }]}>
      <TouchableOpacity style={styles.profileSection} onPress={() => setActiveTab('profile')}>
        <View style={[styles.avatarBox, { backgroundColor: Colors.primary }]}>
          <Ionicons name="person" size={20} color={Colors.white} />
        </View>
        <View>
          <Text style={[styles.welcome, { fontFamily: Typography.heading, color: Colors.primary }]}>
            Hello, {currentUser.name.split(' ')[0]}!
          </Text>
          <Text style={[styles.roleTag, { fontFamily: Typography.bodyBold, color: Colors.secondary }]}>
            {currentUser.role.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {/* Dark Mode Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={15} color={Colors.textDim} />
          <Switch
            value={isDark}
            onValueChange={v => setTheme(v ? 'dark' : 'light')}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary }}
            thumbColor={Colors.white}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>

        <TouchableOpacity style={[styles.bellBtn, { backgroundColor: Colors.surface }]} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: Colors.danger, borderColor: Colors.background }]}>
              <Text style={[styles.badgeText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>


      </View>

      <NotificationBoard visible={showNotifications} onClose={() => setShowNotifications(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 55, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1 },
  welcome: { fontSize: 22 },
  roleTag: { fontSize: 10, textTransform: 'uppercase', marginTop: -2 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: { position: 'relative', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  badge: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  badgeText: { fontSize: 10 },

});