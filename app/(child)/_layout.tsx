import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/useTheme';

export default function ChildTabsLayout() {
    const { Colors, Typography } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textDim,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.surfaceLight,
                    elevation: 20,
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: Typography.subheading,
                    fontSize: 11,
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Earn',
                    tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="economy"
                options={{
                    title: 'Bank',
                    tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="play"
                options={{
                    title: 'Play',
                    tabBarIcon: ({ color }) => <Ionicons name="game-controller-outline" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}
