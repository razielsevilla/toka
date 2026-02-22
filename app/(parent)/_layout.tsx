import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/useTheme';

export default function ParentTabsLayout() {
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
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="review"
                options={{
                    title: 'Review',
                    tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle-outline" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="manage"
                options={{
                    title: 'Manage',
                    tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}
