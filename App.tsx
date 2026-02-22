import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTokaStore } from './src/store/useTokaStore';
import { useTheme } from './src/theme/useTheme';

// Components
import AuthScreen from './src/components/AuthScreen';
import Header from './src/components/Header';
import ParentDashboard from './src/components/ParentDashboard';
import ChildDashboard from './src/components/ChildDashboard';

export default function App() {
  const { currentUser, tickAuction } = useTokaStore();
  const { Colors, isDark } = useTheme();

  let [fontsLoaded] = useFonts({
    Chewy_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (!currentUser) return;
    const auctionInterval = setInterval(() => { tickAuction(); }, 1000);
    return () => { clearInterval(auctionInterval); };
  }, [tickAuction, currentUser]);

  if (!fontsLoaded) return null;

  if (!currentUser) return <AuthScreen />;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Header />
      {currentUser.role === 'admin' ? <ParentDashboard /> : <ChildDashboard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});