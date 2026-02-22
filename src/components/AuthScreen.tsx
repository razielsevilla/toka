import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';

export default function AuthScreen() {
  const { login, mockUsers } = useTokaStore();
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authContainer}>
        {/* Logo and Brand */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={40} color="#FFF" />
          </View>
          <Text style={styles.authTitle}>Toka</Text>
          <Text style={styles.authSubtitle}>Grow Together, Learn Forever.</Text>
        </View>

        {/* Login Card */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Select your profile to continue</Text>

          {mockUsers.map(user => {
            const isSelected = email === user.name.split(' ')[0];
            const isAdmin = user.role === 'admin';
            return (
              <TouchableOpacity
                key={user.id}
                style={[styles.userCard, isSelected && styles.userCardActive]}
                onPress={() => setEmail(user.name.split(' ')[0])}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, isSelected ? styles.iconBoxActive : styles.iconBoxInactive]}>
                  <Ionicons name={isAdmin ? "shield-checkmark" : "person"} size={22} color={isSelected ? "#6C5CE7" : "#A0AEC0"} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, isSelected && styles.userNameActive]}>
                    {user.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.userRoleText}>
                    {isAdmin ? 'Parent Account' : 'Member Account'}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#6C5CE7" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.loginBtn, !email && styles.loginBtnDisabled]}
            disabled={!email}
            onPress={() => login(email, '123')}
          >
            <Text style={styles.btnText}>Sign In to Toka</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#6C5CE7' },
  authContainer: { flex: 1, justifyContent: 'center', padding: 25 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  authTitle: { fontSize: 48, fontWeight: '900', color: 'white', textAlign: 'center', letterSpacing: 1 },
  authSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: 10, fontWeight: '500' },
  inputCard: { backgroundColor: 'white', padding: 30, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  label: { fontSize: 13, color: '#A0AEC0', fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1.5, borderColor: '#F1F2F6', marginBottom: 15, backgroundColor: '#FFF' },
  userCardActive: { borderColor: '#6C5CE7', backgroundColor: '#F4F1FF' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconBoxInactive: { backgroundColor: '#F8F9FA' },
  iconBoxActive: { backgroundColor: '#E0D8FF' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700', color: '#2D3436' },
  userNameActive: { color: '#6C5CE7' },
  userRoleText: { fontSize: 13, color: '#A0AEC0', fontWeight: '500', marginTop: 2 },
  checkIcon: { marginLeft: 10 },
  loginBtn: { backgroundColor: '#6C5CE7', paddingVertical: 18, borderRadius: 16, marginTop: 20, shadowColor: '#6C5CE7', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  loginBtnDisabled: { backgroundColor: '#B2BEC3', shadowOpacity: 0, elevation: 0 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});