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
  const { currentUser, tickAuction, applyInterest } = useTokaStore();

  useEffect(() => {
    if (!currentUser) return;

    // 1. Tick the auction every second
    const auctionInterval = setInterval(() => {
      tickAuction();
    }, 1000);

    // 2. Mock background check for interest growth
    // In a real app, this would compare timestamps. 
    // Here, we'll check every 30 seconds for demo purposes.
    const interestInterval = setInterval(() => {
      // Logic for automated application could go here
      // For now, it stays ready to be called by your logic
    }, 30000);

    return () => {
      clearInterval(auctionInterval);
      clearInterval(interestInterval);
    };
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