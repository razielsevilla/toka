import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTokaStore } from '../store/useTokaStore';

export default function AuthScreen() {
  const { login } = useTokaStore();
  const [email, setEmail] = useState('');

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

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#6C5CE7', justifyContent: 'center', padding: 25 },
  authTitle: { fontSize: 42, fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: 40 },
  inputCard: { backgroundColor: 'white', padding: 25, borderRadius: 25, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 12, color: '#B2BEC3', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  selected: { color: '#6C5CE7', fontWeight: 'bold', fontSize: 20, marginVertical: 12, textAlign: 'center' },
  unselected: { color: '#B2BEC3', fontSize: 18, marginVertical: 12, textAlign: 'center' },
  loginBtn: { backgroundColor: '#6C5CE7', padding: 18, borderRadius: 15, marginTop: 20 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});