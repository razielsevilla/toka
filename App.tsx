import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTokaStore } from './src/store/useTokaStore';
import ParentDashboard from './src/components/ParentDashboard';
import ChildDashboard from './src/components/ChildDashboard';

export default function App() {
  const { currentUser, login, logout, tickAuction } = useTokaStore();
  const [email, setEmail] = React.useState('');

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => tickAuction(), 1000);
    return () => clearInterval(interval);
  }, [tickAuction, currentUser]);

  if (!currentUser) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Toka</Text>
        <View style={styles.inputCard}>
          <Text style={styles.label}>Choose Account to Sign In</Text>
          <TouchableOpacity onPress={() => setEmail('Mom')}>
            <Text style={email === 'Mom' ? styles.selected : styles.unselected}>👩 Parent (Admin)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEmail('Raziel')}>
            <Text style={email === 'Raziel' ? styles.selected : styles.unselected}>🧒 Child (Member)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginBtn} onPress={() => login(email, '123')}>
            <Text style={styles.btnText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* GLOBAL HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hello, {currentUser.name.split(' ')[0]}!</Text>
          <Text style={styles.roleTag}>{currentUser.role.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* ROLE-BASED ROUTING */}
      {currentUser.role === 'admin' ? (
        <ParentDashboard />
      ) : (
        <ChildDashboard />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  authContainer: { flex: 1, backgroundColor: '#6C5CE7', justifyContent: 'center', padding: 25 },
  authTitle: { fontSize: 42, fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: 40 },
  inputCard: { backgroundColor: 'white', padding: 25, borderRadius: 25, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 12, color: '#B2BEC3', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  selected: { color: '#6C5CE7', fontWeight: 'bold', fontSize: 20, marginVertical: 12, textAlign: 'center' },
  unselected: { color: '#B2BEC3', fontSize: 18, marginVertical: 12, textAlign: 'center' },
  loginBtn: { backgroundColor: '#6C5CE7', padding: 18, borderRadius: 15, marginTop: 20 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  roleTag: { fontSize: 10, color: '#6C5CE7', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#F1F2F6', padding: 8, borderRadius: 8 },
  logoutText: { color: '#D63031', fontWeight: 'bold', fontSize: 12 }
});