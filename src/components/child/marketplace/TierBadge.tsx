import React from 'react';
import { View, Text } from 'react-native';
import { TIER_META, ShopTier } from '../../../data/shopCatalog';

interface Props { tier: ShopTier }

export function TierBadge({ tier }: Props) {
    const m = TIER_META[tier];
    return (
        <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, marginBottom: 2, alignSelf: 'flex-start', backgroundColor: m.color + '22', borderColor: m.color }}>
            <Text style={{ fontSize: 8, color: m.color, fontWeight: '900', letterSpacing: 0.5 }}>
                {m.emoji} {m.label.toUpperCase()}
            </Text>
        </View>
    );
}
