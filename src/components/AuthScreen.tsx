import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { useTheme } from '../theme/useTheme';

export default function AuthScreen() {
  const { login, mockUsers, setTheme, theme } = useTokaStore();
  const { Colors, Typography, isDark } = useTheme();
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 25 }}>

        {/* Theme Toggle top-right */}
        <View style={{ position: 'absolute', top: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={Colors.textDim} />
          <Switch
            value={isDark}
            onValueChange={v => setTheme(v ? 'dark' : 'light')}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Logo and Brand */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={[styles.logoCircle, { backgroundColor: Colors.primary + '22', borderColor: Colors.primary, borderWidth: 2 }]}>
            <Ionicons name="leaf" size={40} color={Colors.primary} />
          </View>
          <Text style={[styles.authTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Toka</Text>
          <Text style={[styles.authSubtitle, { fontFamily: Typography.bodyMedium, color: Colors.textDim }]}>Grow Together, Learn Forever.</Text>
        </View>

        {/* Login Card */}
        <View style={[styles.inputCard, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight, shadowColor: Colors.primary }]}>
          <Text style={[styles.label, { fontFamily: Typography.subheading, color: Colors.textDim }]}>Select your profile to continue</Text>

          {mockUsers.map(user => {
            const isSelected = email === user.name.split(' ')[0];
            const isAdmin = user.role === 'admin';
            return (
              <TouchableOpacity
                key={user.id}
                style={[styles.userCard, { borderColor: Colors.surfaceLight, backgroundColor: Colors.surface }, isSelected && { borderColor: Colors.primary, backgroundColor: Colors.primary + '18' }]}
                onPress={() => setEmail(user.name.split(' ')[0])}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: isSelected ? Colors.primary : Colors.surfaceLight }]}>
                  <Ionicons name={isAdmin ? 'shield-checkmark' : 'person'} size={22} color={isSelected ? Colors.white : Colors.textDim} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { fontFamily: Typography.subheading, color: isSelected ? Colors.primary : Colors.text }]}>
                    {user.name.split(' ')[0]}
                  </Text>
                  <Text style={{ fontSize: 13, fontFamily: Typography.body, color: Colors.textDim, marginTop: 2 }}>
                    {isAdmin ? 'Parent Account' : 'Member Account'}
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: email ? Colors.primary : Colors.surfaceLight, shadowColor: Colors.primary }]}
            disabled={!email}
            onPress={() => login(email, '123')}
          >
            <Text style={[styles.btnText, { fontFamily: Typography.subheading, color: email ? Colors.white : Colors.textDim }]}>Sign In to Toka</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  authTitle: { fontSize: 64, textAlign: 'center', letterSpacing: 2 },
  authSubtitle: { fontSize: 16, textAlign: 'center', marginTop: 5 },
  inputCard: { padding: 30, borderRadius: 30, shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10, borderWidth: 1 },
  label: { fontSize: 13, marginBottom: 20, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1.5, marginBottom: 15 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  userName: { fontSize: 18 },
  loginBtn: { paddingVertical: 18, borderRadius: 16, marginTop: 20, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  btnText: { textAlign: 'center', fontSize: 18 },
});