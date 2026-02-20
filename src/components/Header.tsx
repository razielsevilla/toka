import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function Header() {
  const { currentUser, logout } = useTokaStore();

  // Failsafe in case it renders before auth catches it
  if (!currentUser) return null;

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.welcome}>Hello, {currentUser.name.split(' ')[0]}!</Text>
        <Text style={styles.roleTag}>{currentUser.role.toUpperCase()}</Text>
      </View>
      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  roleTag: { fontSize: 10, color: '#6C5CE7', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#F1F2F6', padding: 8, borderRadius: 8 },
  logoutText: { color: '#D63031', fontWeight: 'bold', fontSize: 12 }
});