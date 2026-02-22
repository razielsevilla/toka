import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function getRemainingTime(deadline?: number): string | null {
    if (!deadline) return null;
    const diff = deadline - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

interface Props {
    item: { id: string; name: string; cost: number; type: string; originalCost?: number; saleUntil?: number };
    onBuy: () => void;
    onGoal?: () => void;
    isGoal: boolean;
    userTokens: number;
    goalSavings: number;
    Colors: any;
    Typography: any;
}

export function ParentRewardCard({ item, onBuy, onGoal, isGoal, userTokens, goalSavings, Colors, Typography }: Props) {
    const onSale = item.saleUntil && item.originalCost && item.saleUntil > Date.now();
    const canAfford = (userTokens + goalSavings) >= item.cost;

    return (
        <View style={{ padding: 12, borderRadius: 20, marginRight: 10, width: 140, alignItems: 'center', borderWidth: isGoal ? 2 : 1.5, elevation: 2, backgroundColor: Colors.surfaceLight, borderColor: isGoal ? Colors.secondary : Colors.surfaceLight }}>
            <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, marginBottom: 2, alignSelf: 'flex-start', backgroundColor: Colors.danger + '22', borderColor: Colors.danger }}>
                <Text style={{ fontSize: 8, color: Colors.danger, fontWeight: '900' }}>💝 PARENT</Text>
            </View>
            <Ionicons name={item.cost > 100 ? 'gift' : 'ticket'} size={28} color={Colors.secondary} style={{ marginTop: 6, marginBottom: 6 }} />
            <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 2, height: 30, fontFamily: Typography.subheading, color: Colors.text }} numberOfLines={2}>{item.name}</Text>

            {onSale ? (
                <View style={{ alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginBottom: 4, backgroundColor: Colors.danger }}>
                        <Ionicons name="flash" size={9} color="#FFF" />
                        <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '900' }}>FLASH {getRemainingTime(item.saleUntil ?? undefined)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ textDecorationLine: 'line-through', color: Colors.textDim, fontSize: 10 }}>{item.originalCost}</Text>
                        <Ionicons name="diamond" size={10} color={Colors.danger} />
                        <Text style={{ color: Colors.danger, fontFamily: Typography.heading, fontSize: 14 }}>{item.cost}</Text>
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                    <Ionicons name="diamond" size={10} color={Colors.primary} />
                    <Text style={{ color: Colors.primary, fontFamily: Typography.subheading, fontSize: 13 }}>{item.cost}</Text>
                </View>
            )}

            <TouchableOpacity style={{ paddingVertical: 9, width: '100%', borderRadius: 12, alignItems: 'center', elevation: 1, backgroundColor: canAfford ? Colors.primary : Colors.surfaceLight, opacity: canAfford ? 1 : 0.5 }} onPress={onBuy} disabled={!canAfford}>
                <Text style={{ fontSize: 12, color: canAfford ? '#FFF' : Colors.textDim, fontFamily: Typography.subheading }}>Buy</Text>
            </TouchableOpacity>

            {onGoal !== undefined && (
                <TouchableOpacity onPress={() => !isGoal && onGoal?.()} disabled={isGoal}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                        <Text style={{ fontSize: 10, color: isGoal ? Colors.tertiary : Colors.textDim, fontFamily: Typography.bodyBold }}>{isGoal ? 'Current Goal ✓' : 'Set Goal'}</Text>
                        {!isGoal && <Ionicons name="star" size={10} color={Colors.textDim} />}
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}
