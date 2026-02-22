import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../../store/useTokaStore';
import { useTheme } from '../../../hooks';
import { MERCH_CATALOG, SYSTEM_CATALOG } from '../../../data/shopCatalog';
import { GACHA_COST, CASHOUT_AMOUNT } from '../../../constants';

import { TierBadge } from './TierBadge';
import { RefreshBanner } from './RefreshBanner';
import { SectionHeader } from './SectionHeader';
import { ShopItemCard } from './ShopItemCard';
import { ParentRewardCard } from './ParentRewardCard';
import { GachaModal, LootEntry } from './GachaModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_ORDER = { legendary: 0, rare: 1, uncommon: 2, common: 3 } as const;
const ALL_CATALOG = [...MERCH_CATALOG, ...SYSTEM_CATALOG];

// ─── Marketplace Screen ───────────────────────────────────────────────────────

export default function Marketplace() {
    const { Colors, Typography } = useTheme();
    const {
        currentUser, marketItems, purchaseItem, setWishlistGoal,
        applyGachaPrize, requestAllowanceCashout, notifications,
        clearNotifications, auction, placeBid,
        dailyShop, refreshDailyShop, buyShopItem,
    } = useTokaStore();

    const [gachaOpen, setGachaOpen] = useState(false);
    const userTokens = currentUser?.tokens || 0;
    const marketNotifs = notifications.filter(n => n.type === 'market' && !n.read).length;
    const parentRewards = marketItems.filter(i => i.type !== 'in-app');

    useEffect(() => { refreshDailyShop(); }, []);

    // ── Shop slot helpers ──────────────────────────────────────────────────────

    const getActiveSlots = (category: 'merch' | 'system') =>
        dailyShop.slots
            .filter(slot => ALL_CATALOG.find(c => c.id === slot.itemId && c.category === category))
            .sort((a, b) => {
                const tA = ALL_CATALOG.find(c => c.id === a.itemId)?.tier || 'common';
                const tB = ALL_CATALOG.find(c => c.id === b.itemId)?.tier || 'common';
                return (TIER_ORDER[tA] ?? 3) - (TIER_ORDER[tB] ?? 3);
            });

    const renderShopSection = (category: 'merch' | 'system') => {
        const slots = getActiveSlots(category);
        if (slots.length === 0) {
            return (
                <View style={[styles.emptyTier, { borderColor: Colors.surfaceLight, backgroundColor: Colors.surfaceLight }]}>
                    <Ionicons name="refresh" size={22} color={Colors.textDim} />
                    <Text style={{ color: Colors.textDim, fontFamily: Typography.body, fontSize: 12, textAlign: 'center', marginTop: 6 }}>Shop refreshing soon…</Text>
                </View>
            );
        }
        return slots.map(slot => {
            const item = ALL_CATALOG.find(c => c.id === slot.itemId);
            if (!item) return null;
            return <ShopItemCard key={slot.itemId} item={item} slot={slot} onBuy={() => buyShopItem(slot.itemId)} userTokens={userTokens} Colors={Colors} Typography={Typography} />;
        });
    };

    // ── Gacha ──────────────────────────────────────────────────────────────────

    const buildGachaPool = (): LootEntry[] => {
        const base: LootEntry[] = [
            { label: '₱50 Allowance Cash Out', tier: 'legendary', chance: 2 },
            { label: 'No Chores for 2 Days!', tier: 'legendary', chance: 3 },
            { label: 'XP Booster 3× (10 Chores)', tier: 'rare', chance: 10 },
            { label: 'Streak Shield ×5', tier: 'rare', chance: 10 },
            { label: '50 Bonus Tokens 🪙', tier: 'uncommon', chance: 15, rewardTokens: 50 },
            { label: 'Toka Sticker Pack', tier: 'uncommon', chance: 15 },
            { label: '20 Bonus Tokens 🪙', tier: 'common', chance: 20, rewardTokens: 20 },
            { label: '10 Bonus Tokens 🪙', tier: 'common', chance: 15, rewardTokens: 10 },
            { label: '5 Bonus Tokens 🪙', tier: 'common', chance: 10, rewardTokens: 5 },
        ];
        marketItems.forEach(mi => base.push({ label: `🎁 ${mi.name}`, tier: mi.cost >= 100 ? 'rare' : 'uncommon', chance: 5 }));
        return base;
    };

    const handleSpin = (): LootEntry | null => {
        if (userTokens < GACHA_COST) { Alert.alert('Not enough tokens', `You need ${GACHA_COST} 💎 to spin!`); return null; }
        const pool = buildGachaPool();
        const total = pool.reduce((s, p) => s + p.chance, 0);
        let roll = Math.random() * total;
        let winner = pool[pool.length - 1];
        for (const entry of pool) { roll -= entry.chance; if (roll <= 0) { winner = entry; break; } }
        applyGachaPrize(winner.label, winner.rewardTokens ?? 0);
        return winner;
    };

    const handleAllowanceExchange = () => {
        Alert.alert('Cash Out', `Exchange ${CASHOUT_AMOUNT} 💎 for ₱10 real cash?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Send Request', onPress: () => userTokens >= CASHOUT_AMOUNT ? requestAllowanceCashout(CASHOUT_AMOUNT) : Alert.alert('Not enough tokens!') },
        ]);
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ionicons name="cart" size={22} color={Colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Marketplace</Text>
                {marketNotifs > 0 && (
                    <View style={[styles.badge, { backgroundColor: Colors.danger }]}>
                        <Text style={{ fontSize: 10, color: Colors.white, fontFamily: Typography.bodyBold }}>{marketNotifs}</Text>
                    </View>
                )}
            </View>

            {dailyShop.lastRefresh > 0 && <RefreshBanner lastRefresh={dailyShop.lastRefresh} Colors={Colors} Typography={Typography} />}

            <ScrollView showsVerticalScrollIndicator={false} onScroll={() => marketNotifs > 0 && clearNotifications('market')} scrollEventThrottle={16}>

                {/* ── TIER 1: Parent Rewards ───────────────────────────────────────── */}
                <SectionHeader icon="heart" title="Parent Rewards" subtitle="Custom rewards set by your parents" color={Colors.danger} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                    {auction.isActive && (
                        <View style={[styles.card, { backgroundColor: Colors.danger + '12', borderColor: Colors.danger, width: 158 }]}>
                            <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, marginBottom: 2, alignSelf: 'flex-start', backgroundColor: Colors.danger + '22', borderColor: Colors.danger }}>
                                <Text style={{ fontSize: 8, color: Colors.danger, fontWeight: '900' }}>🔨 AUCTION</Text>
                            </View>
                            <Ionicons name="hammer" size={28} color={Colors.danger} style={{ marginTop: 6, marginBottom: 6 }} />
                            <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 2, height: 30, fontFamily: Typography.subheading, color: Colors.text }} numberOfLines={2}>{auction.itemName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="diamond" size={11} color={Colors.danger} />
                                <Text style={{ fontFamily: Typography.heading, color: Colors.danger, fontSize: 15 }}>{auction.highestBid}</Text>
                            </View>
                            <Text style={{ fontSize: 9, color: Colors.textDim, fontFamily: Typography.bodyBold, marginBottom: 8 }}>
                                {Math.floor(auction.timeLeft / 60)}m {auction.timeLeft % 60}s left
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 4, width: '100%' }}>
                                <TouchableOpacity style={[styles.buyBtn, { flex: 1, backgroundColor: Colors.danger }]} onPress={() => placeBid(auction.highestBid + 10)}>
                                    <Text style={{ fontSize: 12, color: '#FFF', fontFamily: Typography.subheading }}>+10</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buyBtn, { flex: 1, backgroundColor: Colors.danger }]} onPress={() => placeBid(auction.highestBid + 50)}>
                                    <Text style={{ fontSize: 12, color: '#FFF', fontFamily: Typography.subheading }}>+50</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {parentRewards.length === 0 && !auction.isActive && (
                        <View style={[styles.emptyTier, { borderColor: Colors.surfaceLight, backgroundColor: Colors.surfaceLight }]}>
                            <Ionicons name="hourglass" size={22} color={Colors.textDim} />
                            <Text style={{ color: Colors.textDim, fontFamily: Typography.body, fontSize: 12, textAlign: 'center', marginTop: 6 }}>Your parents haven't added any rewards yet!</Text>
                        </View>
                    )}
                    {parentRewards.map(item => {
                        const isGoal = currentUser?.activeGoal?.itemId === item.id;
                        const goalSavings = isGoal ? (currentUser?.activeGoal?.savedTokens || 0) : 0;
                        return <ParentRewardCard key={item.id} item={item} onBuy={() => purchaseItem(item.id)} onGoal={() => setWishlistGoal(item.id)} isGoal={isGoal} userTokens={userTokens} goalSavings={goalSavings} Colors={Colors} Typography={Typography} />;
                    })}
                </ScrollView>

                <View style={[styles.divider, { backgroundColor: Colors.surfaceLight }]} />

                {/* ── TIER 2: Toka Merchandise ─────────────────────────────────────── */}
                <SectionHeader icon="shirt" title="Toka Merchandise" subtitle="Real-life Toka branded products · daily rotation" color={Colors.primary} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                    {renderShopSection('merch')}
                </ScrollView>

                <View style={[styles.divider, { backgroundColor: Colors.surfaceLight }]} />

                {/* ── TIER 3: System Rewards ───────────────────────────────────────── */}
                <SectionHeader icon="sparkles" title="System Rewards" subtitle="Power-ups, cosmetics & Gacha · daily rotation" color={Colors.tertiary} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>

                    {/* Gacha */}
                    <TouchableOpacity style={[styles.card, { width: 150, borderWidth: 2, position: 'relative', borderColor: Colors.tertiary, backgroundColor: Colors.tertiary + '12' }]} onPress={() => setGachaOpen(true)} activeOpacity={0.85}>
                        <View style={{ position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: Colors.tertiary }}>
                            <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '900' }}>🎲 GACHA</Text>
                        </View>
                        <Text style={{ fontSize: 34, marginTop: 10, marginBottom: 4 }}>📦</Text>
                        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 2, height: 30, fontFamily: Typography.subheading, color: Colors.text }}>Loot Box</Text>
                        <Text style={{ fontSize: 8, color: Colors.textDim, textAlign: 'center', fontFamily: Typography.body, marginBottom: 8 }}>Spin the roulette for prizes!</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            <Ionicons name="diamond" size={10} color={Colors.tertiary} />
                            <Text style={{ color: Colors.tertiary, fontFamily: Typography.subheading, fontSize: 13 }}>{GACHA_COST}</Text>
                        </View>
                        <View style={[styles.buyBtn, { backgroundColor: Colors.tertiary }]}>
                            <Text style={{ fontSize: 12, color: '#FFF', fontFamily: Typography.subheading }}>Open!</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Allowance */}
                    <View style={[styles.card, { backgroundColor: Colors.secondary + '12', borderColor: Colors.secondary }]}>
                        <TierBadge tier="uncommon" />
                        <Ionicons name="cash" size={28} color={Colors.secondary} style={{ marginTop: 6, marginBottom: 6 }} />
                        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 2, height: 30, fontFamily: Typography.subheading, color: Colors.text }}>₱10 Allowance</Text>
                        <Text style={{ fontSize: 8, color: Colors.textDim, textAlign: 'center', fontFamily: Typography.body, marginBottom: 6 }}>Exchange tokens for real cash</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 }}>
                            <Ionicons name="diamond" size={10} color={Colors.secondary} />
                            <Text style={{ color: Colors.secondary, fontFamily: Typography.subheading, fontSize: 13 }}>{CASHOUT_AMOUNT}</Text>
                        </View>
                        <TouchableOpacity style={[styles.buyBtn, { backgroundColor: Colors.secondary }]} onPress={handleAllowanceExchange}>
                            <Text style={{ fontSize: 12, color: Colors.white, fontFamily: Typography.subheading }}>Cash Out</Text>
                        </TouchableOpacity>
                    </View>

                    {renderShopSection('system')}
                </ScrollView>
            </ScrollView>

            <GachaModal visible={gachaOpen} onClose={() => setGachaOpen(false)} pool={buildGachaPool()} onSpin={handleSpin} />
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, borderWidth: 1 },
    sectionTitle: { fontSize: 24 },
    badge: { minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    divider: { height: 1, borderRadius: 1, marginVertical: 8 },
    emptyTier: { width: 200, padding: 20, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginRight: 12 },
    card: { padding: 12, borderRadius: 20, marginRight: 10, width: 140, alignItems: 'center', borderWidth: 1.5, elevation: 2 },
    buyBtn: { paddingVertical: 9, width: '100%', borderRadius: 12, alignItems: 'center', elevation: 1 },
});
