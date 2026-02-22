import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCountdown } from '../../../hooks';
import { ONE_DAY_MS } from '../../../constants';

interface Props {
    lastRefresh: number;
    Colors: any;
    Typography: any;
}

function formatCountdown(ms: number): string {
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

export function RefreshBanner({ lastRefresh, Colors, Typography }: Props) {
    const nextRefresh = lastRefresh + ONE_DAY_MS;
    const remaining = useCountdown(nextRefresh);
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12, borderWidth: 1, marginBottom: 12, backgroundColor: Colors.surfaceLight, borderColor: Colors.primary }}>
            <Ionicons name="refresh-circle" size={14} color={Colors.primary} />
            <Text style={{ color: Colors.primary, fontFamily: Typography.bodyBold, fontSize: 11 }}>
                Shop refreshes in {formatCountdown(remaining)}
            </Text>
        </View>
    );
}
