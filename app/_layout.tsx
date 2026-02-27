import React, { useEffect } from 'react';
import { View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTokaStore } from '../src/store/useTokaStore';
import { useTheme } from '../src/theme/useTheme';
import '../src/i18n';

import Header from '../src/components/Header';

export default function RootLayout() {
    const { currentUser, tickAuction } = useTokaStore();
    const { Colors, isDark } = useTheme();

    const segments = useSegments();
    const router = useRouter();

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

    useEffect(() => {
        if (!fontsLoaded) return;

        // Check if the current route is within the auth group
        const inAuthGroup = segments[0] === '(auth)';

        if (!currentUser && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (currentUser && inAuthGroup) {
            router.replace(currentUser.role === 'admin' ? '/(parent)/home' : '/(child)/home');
        }
    }, [currentUser, segments, fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <Header />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                    <Stack.Screen name="(child)" options={{ headerShown: false }} />
                    <Stack.Screen name="(parent)" options={{ headerShown: false }} />
                    <Stack.Screen name="profile" options={{ presentation: 'modal', headerShown: false }} />
                </Stack>
            </View>
        </QueryClientProvider>
    );
}
