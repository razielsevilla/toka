import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
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
        <Text style={styles.authTitle}>Toka Login</Text>
        <View style={styles.inputCard}>
          <TouchableOpacity onPress={() => setEmail('Mom')}><Text style={email === 'Mom' ? styles.selected : styles.unselected}>Parent Account</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setEmail('Raziel')}><Text style={email === 'Raziel' ? styles.selected : styles.unselected}>Child Account</Text></TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={() => login(email, '123')}><Text style={styles.btnText}>Sign In</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.welcome}>Hello, {currentUser.name}</Text>
        <TouchableOpacity onPress={logout}><Text style={styles.logout}>Sign Out</Text></TouchableOpacity>
      </View>

      {/* ROLE ROUTER */}
      {currentUser.role === 'admin' ? <ParentDashboard /> : <ChildDashboard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  authContainer: { flex: 1, backgroundColor: '#6C5CE7', justifyContent: 'center', padding: 20 },
  authTitle: { fontSize: 32, fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: 30 },
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 20 },
  selected: { color: '#6C5CE7', fontWeight: 'bold', fontSize: 18, marginVertical: 10 },
  unselected: { color: '#B2BEC3', fontSize: 16, marginVertical: 10 },
  loginBtn: { backgroundColor: '#6C5CE7', padding: 15, borderRadius: 10, marginTop: 20 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 15 },
  welcome: { fontSize: 20, fontWeight: 'bold' },
  logout: { color: '#D63031', fontWeight: 'bold' }
});