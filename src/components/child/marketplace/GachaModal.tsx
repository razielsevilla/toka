import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks';
import { TIER_META, ShopTier } from '../../../data/shopCatalog';

export interface LootEntry { label: string; tier: ShopTier; chance: number; rewardTokens?: number; }

interface Props {
    visible: boolean;
    onClose: () => void;
    pool: LootEntry[];
    onSpin: () => LootEntry | null;
}

const ITEM_W = 112;
const LANDING = 12;
const VISIBLE_W = 320;
const TARGET_X = -(LANDING * ITEM_W - (VISIBLE_W / 2 - ITEM_W / 2));

export function GachaModal({ visible, onClose, pool, onSpin }: Props) {
    const { Colors, Typography } = useTheme();
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<LootEntry | null>(null);
    const [strip, setStrip] = useState<LootEntry[]>([]);
    const scrollX = useRef(new Animated.Value(0)).current;

    const buildStrip = (winner: LootEntry): LootEntry[] =>
        Array.from({ length: 25 }, (_, i) =>
            i === LANDING ? winner : pool[Math.floor(Math.random() * pool.length)]
        );

    const handleSpin = () => {
        if (spinning) return;
        const prize = onSpin();
        if (!prize) return;
        setStrip(buildStrip(prize));
        setResult(null);
        setSpinning(true);
        scrollX.setValue(0);
        Animated.sequence([
            Animated.timing(scrollX, { toValue: TARGET_X - ITEM_W * 8, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(scrollX, { toValue: TARGET_X, duration: 2200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start(() => { setSpinning(false); setResult(prize); });
    };

    const tierColor = result ? TIER_META[result.tier].color : Colors.primary;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                <View style={{ width: '100%', borderRadius: 30, padding: 24, elevation: 20, backgroundColor: Colors.surface }}>

                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name="cube" size={22} color={Colors.tertiary} />
                            <Text style={{ fontSize: 22, fontFamily: Typography.heading, color: Colors.text }}>Gacha Loot Box</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={{ padding: 6, borderRadius: 12, backgroundColor: Colors.surfaceLight }}>
                            <Ionicons name="close" size={18} color={Colors.textDim} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: Colors.textDim, fontSize: 10, fontFamily: Typography.body, marginBottom: 16 }}>
                        🌟 5% Legendary · 💎 20% Rare · 🎁 30% Uncommon · 📦 45% Common
                    </Text>

                    {/* Roulette rail */}
                    <View style={{ height: 86, borderRadius: 16, overflow: 'hidden', borderWidth: 2, marginBottom: 14, position: 'relative', borderColor: Colors.primary, backgroundColor: Colors.surfaceLight }}>
                        <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, zIndex: 10, borderWidth: 1, borderStyle: 'dashed', opacity: 0.6, borderColor: Colors.primary }} />
                        <Animated.View style={{ flexDirection: 'row', position: 'absolute', top: 0, left: 0, height: '100%', alignItems: 'center', transform: [{ translateX: scrollX }] }}>
                            {(strip.length > 0 ? strip : [...pool, ...pool]).map((item: LootEntry, i: number) => (
                                <View key={i} style={{ height: 78, borderRadius: 12, marginHorizontal: 3, justifyContent: 'center', alignItems: 'center', borderWidth: 1, padding: 4, width: ITEM_W - 8, backgroundColor: TIER_META[item.tier].color + '22', borderColor: TIER_META[item.tier].color }}>
                                    <Text style={{ fontSize: 20, marginBottom: 2 }}>{TIER_META[item.tier].emoji}</Text>
                                    <Text style={{ fontSize: 8, fontWeight: '800', color: TIER_META[item.tier].color, textAlign: 'center' }} numberOfLines={2}>{item.label}</Text>
                                </View>
                            ))}
                        </Animated.View>
                    </View>

                    {/* Result */}
                    {result && !spinning && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, marginBottom: 14, backgroundColor: tierColor + '18', borderColor: tierColor }}>
                            <Text style={{ fontSize: 30 }}>{TIER_META[result.tier].emoji}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: Typography.subheading, color: tierColor, fontSize: 12 }}>{result.tier.toUpperCase()}</Text>
                                <Text style={{ fontFamily: Typography.bodyBold, color: Colors.text, fontSize: 14 }}>{result.label}</Text>
                            </View>
                        </View>
                    )}

                    {/* Spin button */}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: spinning ? Colors.textDim : Colors.tertiary }}
                        onPress={handleSpin} disabled={spinning}
                    >
                        <Text style={{ fontSize: 15, color: Colors.white, fontFamily: Typography.subheading }}>
                            {spinning ? 'Spinning...' : result ? 'Spin Again (40 💎)' : 'Spin! (40 💎)'}
                        </Text>
                        {!spinning && <Ionicons name="refresh-circle" size={18} color={Colors.white} />}
                    </TouchableOpacity>

                    {/* Legend */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                        {(Object.entries(TIER_META) as [ShopTier, any][]).map(([tier, m]) => (
                            <View key={tier} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.color }} />
                                <Text style={{ fontSize: 9, color: Colors.textDim, fontFamily: Typography.bodyBold }}>{m.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
