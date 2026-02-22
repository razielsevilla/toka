import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { Colors, Typography } from '../theme/colors';

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
                  <Ionicons name={isAdmin ? "shield-checkmark" : "person"} size={22} color={isSelected ? Colors.background : "#A0AEC0"} />
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
                  <Ionicons name="checkmark-circle" size={24} color={Colors.background} style={styles.checkIcon} />
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
  safeArea: { flex: 1, backgroundColor: Colors.background },
  authContainer: { flex: 1, justifyContent: 'center', padding: 25 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  authTitle: { fontSize: 64, fontFamily: Typography.heading, color: Colors.primary, textAlign: 'center', letterSpacing: 2 },
  authSubtitle: { fontSize: 16, fontFamily: Typography.bodyMedium, color: Colors.text, textAlign: 'center', marginTop: 5 },
  inputCard: { backgroundColor: Colors.surface, padding: 30, borderRadius: 30, shadowColor: Colors.primary, shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10, borderWidth: 1, borderColor: Colors.surfaceLight },
  label: { fontSize: 13, fontFamily: Typography.subheading, color: Colors.textDim, marginBottom: 20, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.surfaceLight, marginBottom: 15, backgroundColor: Colors.surface },
  userCardActive: { borderColor: Colors.primary, backgroundColor: 'rgba(49, 255, 236, 0.1)' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconBoxInactive: { backgroundColor: Colors.surfaceLight },
  iconBoxActive: { backgroundColor: Colors.primary },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontFamily: Typography.subheading, color: Colors.text },
  userNameActive: { color: Colors.primary },
  userRoleText: { fontSize: 13, fontFamily: Typography.body, color: Colors.textDim, marginTop: 2 },
  checkIcon: { marginLeft: 10, color: Colors.primary },
  loginBtn: { backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: 16, marginTop: 20, shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  loginBtnDisabled: { backgroundColor: Colors.surfaceLight, shadowOpacity: 0, elevation: 0 },
  btnText: { color: Colors.background, textAlign: 'center', fontFamily: Typography.subheading, fontSize: 18 },
});