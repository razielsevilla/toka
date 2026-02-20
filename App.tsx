import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTokaStore } from './src/store/useTokaStore';

// Components
import AuthScreen from './src/components/AuthScreen';
import Header from './src/components/Header';
import ParentDashboard from './src/components/ParentDashboard';
import ChildDashboard from './src/components/ChildDashboard';

export default function App() {
  const { currentUser, tickAuction } = useTokaStore();

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => tickAuction(), 1000);
    return () => clearInterval(interval);
  }, [tickAuction, currentUser]);

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* GLOBAL HEADER */}
      <Header />

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
});