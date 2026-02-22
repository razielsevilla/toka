import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks';

interface Props {
    icon: any;
    title: string;
    subtitle: string;
    color: string;
}

export function SectionHeader({ icon, title, subtitle, color }: Props) {
    const { Colors, Typography } = useTheme();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: color + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: Typography.subheading, color: Colors.text, fontSize: 17 }}>{title}</Text>
                <Text style={{ fontFamily: Typography.body, color: Colors.textDim, fontSize: 10 }}>{subtitle}</Text>
            </View>
        </View>
    );
}
