import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TIER_META, CatalogItem } from '../../../data/shopCatalog';
import { ShopSlot } from '../../../types';
import { useCountdown } from '../../../hooks';
import { TierBadge } from './TierBadge';

function formatCountdown(ms: number): string {
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

interface Props {
    item: CatalogItem;
    slot: ShopSlot;
    onBuy: () => void;
    userTokens: number;
    Colors: any;
    Typography: any;
}

export function ShopItemCard({ item, slot, onBuy, userTokens, Colors, Typography }: Props) {
    const timeLeft = Math.max(0, slot.expiresAt - Date.now());
    const isExpired = timeLeft === 0;
    const isSoldOut = slot.stock <= 0;
    const canAfford = userTokens >= item.cost && !isExpired && !isSoldOut;
    const isLimited = item.tier === 'legendary' || item.tier === 'rare';
    const timerMs = useCountdown(slot.expiresAt);

    const tierColor = TIER_META[item.tier].color;
    const cardBg = isSoldOut || isExpired ? Colors.surfaceLight : tierColor + '12';
    const borderColor = isSoldOut || isExpired ? Colors.surfaceLight : tierColor;

    return (
        <View style={{ padding: 12, borderRadius: 20, marginRight: 10, width: 140, alignItems: 'center', borderWidth: 1.5, elevation: 2, backgroundColor: cardBg, borderColor, opacity: (isSoldOut || isExpired) ? 0.55 : 1 }}>
            <TierBadge tier={item.tier} />
            <Ionicons name={item.icon as any} size={28} color={tierColor} style={{ marginTop: 6, marginBottom: 6 }} />
            <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 2, height: 30, fontFamily: Typography.subheading, color: Colors.text }} numberOfLines={2}>{item.name}</Text>
            <Text style={{ fontSize: 8, color: Colors.textDim, textAlign: 'center', marginBottom: 6, fontFamily: Typography.body }} numberOfLines={2}>{item.desc}</Text>

            {/* Price */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                <Ionicons name="diamond" size={10} color={tierColor} />
                <Text style={{ color: tierColor, fontFamily: Typography.subheading, fontSize: 13 }}>{item.cost}</Text>
            </View>

            {/* Stock */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                {isSoldOut ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: Colors.danger + '22' }}>
                        <Text style={{ fontSize: 9, color: Colors.danger, fontWeight: '800' }}>SOLD OUT</Text>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: Colors.tertiary + '22' }}>
                        <Ionicons name="layers" size={9} color={Colors.tertiary} />
                        <Text style={{ fontSize: 9, color: Colors.tertiary, fontWeight: '700' }}>{slot.stock} left</Text>
                    </View>
                )}
            </View>

            {/* Timer for limited items */}
            {isLimited && !isSoldOut && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                    <Ionicons name="timer" size={9} color={isExpired ? Colors.danger : Colors.secondary} />
                    <Text style={{ fontSize: 9, color: isExpired ? Colors.danger : Colors.secondary, fontWeight: '700' }}>
                        {isExpired ? 'EXPIRED' : formatCountdown(timerMs)}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                style={{ paddingVertical: 9, width: '100%', borderRadius: 12, alignItems: 'center', elevation: 1, backgroundColor: canAfford ? tierColor : Colors.surfaceLight, opacity: canAfford ? 1 : 0.5 }}
                onPress={onBuy}
                disabled={!canAfford}
            >
                <Text style={{ fontSize: 12, color: canAfford ? '#FFF' : Colors.textDim, fontFamily: Typography.subheading }}>
                    {isSoldOut ? 'Sold Out' : isExpired ? 'Expired' : 'Buy'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
