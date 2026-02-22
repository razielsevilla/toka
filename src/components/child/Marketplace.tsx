import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
  Modal, Animated, Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';
import {
  MERCH_CATALOG, SYSTEM_CATALOG, TIER_META, ShopTier, CatalogItem,
} from '../../data/shopCatalog';
import type { ShopSlot } from '../../types';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LootEntry { label: string; tier: ShopTier; chance: number; rewardTokens?: number; }

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Expired';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getRemainingTime(deadline?: number) {
  if (!deadline) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// ─── Countdown Hook ────────────────────────────────────────────────────────────

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => {
      const r = Math.max(0, target - Date.now());
      setRemaining(r);
      if (r === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  return remaining;
}

// ─── Tier Badge ────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: ShopTier }) {
  const m = TIER_META[tier];
  return (
    <View style={[styles.tierBadge, { backgroundColor: m.color + '22', borderColor: m.color }]}>
      <Text style={{ fontSize: 8, color: m.color, fontWeight: '900', letterSpacing: 0.5 }}>
        {m.emoji} {m.label.toUpperCase()}
      </Text>
    </View>
  );
}

// ─── Shop Item Card ────────────────────────────────────────────────────────────

function ShopItemCard({ item, slot, onBuy, userTokens, Colors, Typography }: {
  item: CatalogItem; slot: ShopSlot; onBuy: () => void; userTokens: number;
  Colors: any; Typography: any;
}) {
  const now = Date.now();
  const timeLeft = Math.max(0, slot.expiresAt - now);
  const isExpired = timeLeft === 0;
  const isSoldOut = slot.stock <= 0;
  const canAfford = userTokens >= item.cost && !isExpired && !isSoldOut;
  const isLimited = item.tier === 'legendary' || item.tier === 'rare';
  const timerMs = useCountdown(slot.expiresAt);

  const cardBg = isSoldOut || isExpired
    ? Colors.surfaceLight
    : TIER_META[item.tier].color + '12';
  const borderColor = isSoldOut || isExpired
    ? Colors.surfaceLight
    : TIER_META[item.tier].color;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor, opacity: (isSoldOut || isExpired) ? 0.55 : 1 }]}>
      {/* Tier badge */}
      <TierBadge tier={item.tier} />

      {/* Icon */}
      <Ionicons name={item.icon as any} size={28} color={TIER_META[item.tier].color} style={{ marginTop: 6, marginBottom: 6 }} />

      {/* Name */}
      <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]} numberOfLines={2}>{item.name}</Text>

      {/* Desc */}
      <Text style={{ fontSize: 8, color: Colors.textDim, textAlign: 'center', marginBottom: 6, fontFamily: Typography.body }} numberOfLines={2}>{item.desc}</Text>

      {/* Price */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 }}>
        <Ionicons name="diamond" size={10} color={TIER_META[item.tier].color} />
        <Text style={{ color: TIER_META[item.tier].color, fontFamily: Typography.subheading, fontSize: 13 }}>{item.cost}</Text>
      </View>

      {/* Stock */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        {isSoldOut ? (
          <View style={[styles.stockBadge, { backgroundColor: Colors.danger + '22' }]}>
            <Text style={{ fontSize: 9, color: Colors.danger, fontWeight: '800' }}>SOLD OUT</Text>
          </View>
        ) : (
          <View style={[styles.stockBadge, { backgroundColor: Colors.tertiary + '22' }]}>
            <Ionicons name="layers" size={9} color={Colors.tertiary} />
            <Text style={{ fontSize: 9, color: Colors.tertiary, fontWeight: '700' }}>{slot.stock} left</Text>
          </View>
        )}
      </View>

      {/* Timer (only for rare/legendary) */}
      {isLimited && !isSoldOut && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 }}>
          <Ionicons name="timer" size={9} color={isExpired ? Colors.danger : Colors.secondary} />
          <Text style={{ fontSize: 9, color: isExpired ? Colors.danger : Colors.secondary, fontWeight: '700' }}>
            {isExpired ? 'EXPIRED' : formatCountdown(timerMs)}
          </Text>
        </View>
      )}

      {/* Buy button */}
      <TouchableOpacity
        style={[styles.buyBtn, {
          backgroundColor: canAfford ? TIER_META[item.tier].color : Colors.surfaceLight,
          opacity: canAfford ? 1 : 0.5,
        }]}
        onPress={onBuy}
        disabled={!canAfford}
      >
        <Text style={[styles.buyBtnText, { color: canAfford ? '#FFF' : Colors.textDim, fontFamily: Typography.subheading }]}>
          {isSoldOut ? 'Sold Out' : isExpired ? 'Expired' : 'Buy'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Parent Reward Card ────────────────────────────────────────────────────────

function ParentRewardCard({ item, onBuy, onGoal, isGoal, userTokens, goalSavings, Colors, Typography }: any) {
  const onSale = item.saleUntil && item.originalCost && item.saleUntil > Date.now();
  const canAfford = (userTokens + goalSavings) >= item.cost;
  return (
    <View style={[styles.card, { backgroundColor: Colors.surfaceLight, borderColor: isGoal ? Colors.secondary : Colors.surfaceLight }, isGoal && { borderWidth: 2 }]}>
      <View style={[styles.tierBadge, { backgroundColor: Colors.danger + '22', borderColor: Colors.danger }]}>
        <Text style={{ fontSize: 8, color: Colors.danger, fontWeight: '900' }}>💝 PARENT</Text>
      </View>
      <Ionicons name={item.cost > 100 ? 'gift' : 'ticket'} size={28} color={Colors.secondary} style={{ marginTop: 6, marginBottom: 6 }} />
      <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]} numberOfLines={2}>{item.name}</Text>
      {onSale ? (
        <View style={{ alignItems: 'center', marginBottom: 6 }}>
          <View style={[styles.saleTag, { backgroundColor: Colors.danger }]}>
            <Ionicons name="flash" size={9} color="#FFF" />
            <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '900' }}>FLASH {getRemainingTime(item.saleUntil)}</Text>
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
      <TouchableOpacity style={[styles.buyBtn, { backgroundColor: canAfford ? Colors.primary : Colors.surfaceLight, opacity: canAfford ? 1 : 0.5 }]} onPress={onBuy} disabled={!canAfford}>
        <Text style={[styles.buyBtnText, { color: canAfford ? '#FFF' : Colors.textDim, fontFamily: Typography.subheading }]}>Buy</Text>
      </TouchableOpacity>
      {onGoal !== undefined && (
        <TouchableOpacity onPress={() => !isGoal && onGoal()} disabled={isGoal}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <Text style={{ fontSize: 10, color: isGoal ? Colors.tertiary : Colors.textDim, fontFamily: Typography.bodyBold }}>{isGoal ? 'Current Goal ✓' : 'Set Goal'}</Text>
            {!isGoal && <Ionicons name="star" size={10} color={Colors.textDim} />}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, color }: { icon: any; title: string; subtitle: string; color: string }) {
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

// ─── Gacha Roulette Modal ──────────────────────────────────────────────────────

function GachaModal({ visible, onClose, pool, onSpin }: {
  visible: boolean; onClose: () => void;
  pool: LootEntry[]; onSpin: () => LootEntry | null;
}) {
  const { Colors, Typography } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<LootEntry | null>(null);
  const [strip, setStrip] = useState<LootEntry[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  const ITEM_W = 112;
  const LANDING = 12;
  const VISIBLE_W = 320;
  const targetX = -(LANDING * ITEM_W - (VISIBLE_W / 2 - ITEM_W / 2));

  const buildStrip = (winner: LootEntry): LootEntry[] =>
    Array.from({ length: 25 }, (_, i) =>
      i === LANDING ? winner : pool[Math.floor(Math.random() * pool.length)]
    );

  const handleSpin = () => {
    if (spinning) return;
    const prize = onSpin();
    if (!prize) return;
    const newStrip = buildStrip(prize);
    setStrip(newStrip);
    setResult(null);
    setSpinning(true);
    scrollX.setValue(0);
    Animated.sequence([
      Animated.timing(scrollX, { toValue: targetX - ITEM_W * 8, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(scrollX, { toValue: targetX, duration: 2200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(() => { setSpinning(false); setResult(prize); });
  };

  const tierColor = result ? TIER_META[result.tier].color : Colors.primary;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.gachaOverlay}>
        <View style={[styles.gachaSheet, { backgroundColor: Colors.surface }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="cube" size={22} color={Colors.tertiary} />
              <Text style={[styles.gachaTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Gacha Loot Box</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeIcon, { backgroundColor: Colors.surfaceLight }]}>
              <Ionicons name="close" size={18} color={Colors.textDim} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: Colors.textDim, fontSize: 10, fontFamily: Typography.body, marginBottom: 16 }}>
            🌟 5% Legendary · 💎 20% Rare · 🎁 30% Uncommon · 📦 45% Common
          </Text>

          {/* Rail */}
          <View style={[styles.rouletteWindow, { borderColor: Colors.primary, backgroundColor: Colors.surfaceLight }]}>
            <View style={[styles.rouletteIndicator, { borderColor: Colors.primary }]} />
            <Animated.View style={[styles.rouletteStrip, { transform: [{ translateX: scrollX }] }]}>
              {(strip.length > 0 ? strip : [...pool, ...pool]).map((item: LootEntry, i: number) => (
                <View key={i} style={[styles.rouletteItem, { backgroundColor: TIER_META[item.tier].color + '22', borderColor: TIER_META[item.tier].color, width: ITEM_W - 8 }]}>
                  <Text style={{ fontSize: 20, marginBottom: 2 }}>{TIER_META[item.tier].emoji}</Text>
                  <Text style={{ fontSize: 8, fontWeight: '800', color: TIER_META[item.tier].color, textAlign: 'center' }} numberOfLines={2}>{item.label}</Text>
                </View>
              ))}
            </Animated.View>
          </View>

          {/* Result */}
          {result && !spinning && (
            <View style={[styles.resultBox, { backgroundColor: tierColor + '18', borderColor: tierColor }]}>
              <Text style={{ fontSize: 30 }}>{TIER_META[result.tier].emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: Typography.subheading, color: tierColor, fontSize: 12 }}>{result.tier.toUpperCase()}</Text>
                <Text style={{ fontFamily: Typography.bodyBold, color: Colors.text, fontSize: 14 }}>{result.label}</Text>
              </View>
            </View>
          )}

          {/* Spin */}
          <TouchableOpacity style={[styles.spinBtn, { backgroundColor: spinning ? Colors.textDim : Colors.tertiary }]} onPress={handleSpin} disabled={spinning}>
            <Text style={[styles.spinBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>
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

// ─── Shop Refresh Banner ───────────────────────────────────────────────────────

function RefreshBanner({ lastRefresh, Colors, Typography }: { lastRefresh: number; Colors: any; Typography: any }) {
  const nextRefresh = lastRefresh + 24 * 3600 * 1000;
  const remaining = useCountdown(nextRefresh);
  return (
    <View style={[styles.refreshBanner, { backgroundColor: Colors.surfaceLight, borderColor: Colors.primary }]}>
      <Ionicons name="refresh-circle" size={14} color={Colors.primary} />
      <Text style={{ color: Colors.primary, fontFamily: Typography.bodyBold, fontSize: 11 }}>
        Shop refreshes in {formatCountdown(remaining)}
      </Text>
    </View>
  );
}

// ─── Main Marketplace ──────────────────────────────────────────────────────────

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

  // Trigger refresh check on mount
  useEffect(() => { refreshDailyShop(); }, []);

  // Separate parent rewards from in-app type items
  const parentRewards = marketItems.filter(i => i.type !== 'in-app');

  // Get active shop slots for a category
  const getActiveSlots = (category: 'merch' | 'system') => {
    const catalog = category === 'merch' ? MERCH_CATALOG : SYSTEM_CATALOG;
    const now = Date.now();
    return dailyShop.slots
      .filter(slot => {
        const item = catalog.find(c => c.id === slot.itemId);
        return !!item; // belongs to this category
      })
      .sort((a, b) => {
        // Sort: Legendary → Rare → Uncommon → Common, then by tier within
        const tierOrder = { legendary: 0, rare: 1, uncommon: 2, common: 3 };
        const catA = [...MERCH_CATALOG, ...SYSTEM_CATALOG].find(c => c.id === a.itemId);
        const catB = [...MERCH_CATALOG, ...SYSTEM_CATALOG].find(c => c.id === b.itemId);
        return (tierOrder[catA?.tier || 'common'] ?? 3) - (tierOrder[catB?.tier || 'common'] ?? 3);
      });
  };

  // Gacha pool
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
    marketItems.forEach(mi => {
      base.push({ label: `🎁 ${mi.name}`, tier: mi.cost >= 100 ? 'rare' : 'uncommon', chance: 5 });
    });
    return base;
  };

  const handleSpin = (): LootEntry | null => {
    if (userTokens < 40) { Alert.alert('Not enough tokens', 'You need 40 💎 to spin!'); return null; }
    const pool = buildGachaPool();
    const totalWeight = pool.reduce((s, p) => s + p.chance, 0);
    let roll = Math.random() * totalWeight;
    let winner = pool[pool.length - 1];
    for (const entry of pool) { roll -= entry.chance; if (roll <= 0) { winner = entry; break; } }
    applyGachaPrize(winner.label, winner.rewardTokens ?? 0);
    return winner;
  };

  const handleAllowanceExchange = () => {
    Alert.alert('Cash Out', 'Exchange 100 💎 for ₱10 real cash?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Request', onPress: () => userTokens >= 100 ? requestAllowanceCashout(100) : Alert.alert('Not enough tokens!') }
    ]);
  };

  const allCatalog = [...MERCH_CATALOG, ...SYSTEM_CATALOG];

  const renderShopSection = (category: 'merch' | 'system') => {
    const slots = getActiveSlots(category);
    if (slots.length === 0) {
      return (
        <View style={[styles.emptyTier, { borderColor: Colors.surfaceLight, backgroundColor: Colors.surfaceLight }]}>
          <Ionicons name="refresh" size={22} color={Colors.textDim} />
          <Text style={{ color: Colors.textDim, fontFamily: Typography.body, fontSize: 12, textAlign: 'center', marginTop: 6 }}>
            Shop refreshing soon…
          </Text>
        </View>
      );
    }
    return slots.map(slot => {
      const item = allCatalog.find(c => c.id === slot.itemId);
      if (!item) return null;
      return (
        <ShopItemCard
          key={slot.itemId}
          item={item} slot={slot}
          onBuy={() => buyShopItem(slot.itemId)}
          userTokens={userTokens}
          Colors={Colors} Typography={Typography}
        />
      );
    });
  };

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="cart" size={22} color={Colors.primary} />
          <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Marketplace</Text>
          {marketNotifs > 0 && (
            <View style={[styles.badge, { backgroundColor: Colors.danger }]}>
              <Text style={[styles.badgeText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>{marketNotifs}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Refresh countdown */}
      {dailyShop.lastRefresh > 0 && <RefreshBanner lastRefresh={dailyShop.lastRefresh} Colors={Colors} Typography={Typography} />}

      <ScrollView showsVerticalScrollIndicator={false} onScroll={() => marketNotifs > 0 && clearNotifications('market')} scrollEventThrottle={16}>

        {/* ══════════════════════════════════════════════════ */}
        {/* TIER 1 – PARENT REWARDS                           */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionHeader icon="heart" title="Parent Rewards" subtitle="Custom rewards set by your parents" color={Colors.danger} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {auction.isActive && (
            <View style={[styles.card, { backgroundColor: Colors.danger + '12', borderColor: Colors.danger, width: 158 }]}>
              <View style={[styles.tierBadge, { backgroundColor: Colors.danger + '22', borderColor: Colors.danger }]}>
                <Text style={{ fontSize: 8, color: Colors.danger, fontWeight: '900' }}>🔨 AUCTION</Text>
              </View>
              <Ionicons name="hammer" size={28} color={Colors.danger} style={{ marginTop: 6, marginBottom: 6 }} />
              <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]} numberOfLines={2}>{auction.itemName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="diamond" size={11} color={Colors.danger} />
                <Text style={[{ fontFamily: Typography.heading, color: Colors.danger, fontSize: 15 }]}>{auction.highestBid}</Text>
              </View>
              <Text style={{ fontSize: 9, color: Colors.textDim, fontFamily: Typography.bodyBold, marginBottom: 8 }}>
                {Math.floor(auction.timeLeft / 60)}m {auction.timeLeft % 60}s left
              </Text>
              <View style={{ flexDirection: 'row', gap: 4, width: '100%' }}>
                <TouchableOpacity style={[styles.buyBtn, { flex: 1, backgroundColor: Colors.danger }]} onPress={() => placeBid(auction.highestBid + 10)}>
                  <Text style={[styles.buyBtnText, { color: '#FFF', fontFamily: Typography.subheading }]}>+10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buyBtn, { flex: 1, backgroundColor: Colors.danger }]} onPress={() => placeBid(auction.highestBid + 50)}>
                  <Text style={[styles.buyBtnText, { color: '#FFF', fontFamily: Typography.subheading }]}>+50</Text>
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
            return (
              <ParentRewardCard
                key={item.id} item={item}
                onBuy={() => purchaseItem(item.id)}
                onGoal={() => setWishlistGoal(item.id)}
                isGoal={isGoal} userTokens={userTokens} goalSavings={goalSavings}
                Colors={Colors} Typography={Typography}
              />
            );
          })}
        </ScrollView>

        <View style={[styles.divider, { backgroundColor: Colors.surfaceLight }]} />

        {/* ══════════════════════════════════════════════════ */}
        {/* TIER 2 – TOKA MERCHANDISE                         */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionHeader icon="shirt" title="Toka Merchandise" subtitle="Real-life Toka branded products · daily rotation" color={Colors.primary} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {renderShopSection('merch')}
        </ScrollView>

        <View style={[styles.divider, { backgroundColor: Colors.surfaceLight }]} />

        {/* ══════════════════════════════════════════════════ */}
        {/* TIER 3 – SYSTEM REWARDS                           */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionHeader icon="sparkles" title="System Rewards" subtitle="Power-ups, cosmetics & Gacha · daily rotation" color={Colors.tertiary} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>

          {/* Gacha Card */}
          <TouchableOpacity
            style={[styles.card, styles.gachaCard, { borderColor: Colors.tertiary, backgroundColor: Colors.tertiary + '12' }]}
            onPress={() => setGachaOpen(true)} activeOpacity={0.85}
          >
            <View style={[styles.gachaBadge, { backgroundColor: Colors.tertiary }]}>
              <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '900' }}>🎲 GACHA</Text>
            </View>
            <Text style={{ fontSize: 34, marginTop: 10, marginBottom: 4 }}>📦</Text>
            <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]}>Loot Box</Text>
            <Text style={{ fontSize: 8, color: Colors.textDim, textAlign: 'center', fontFamily: Typography.body, marginBottom: 8 }}>Spin the roulette for prizes!</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Ionicons name="diamond" size={10} color={Colors.tertiary} />
              <Text style={{ color: Colors.tertiary, fontFamily: Typography.subheading, fontSize: 13 }}>40</Text>
            </View>
            <View style={[styles.buyBtn, { backgroundColor: Colors.tertiary }]}>
              <Text style={[styles.buyBtnText, { color: '#FFF', fontFamily: Typography.subheading }]}>Open!</Text>
            </View>
          </TouchableOpacity>

          {/* Allowance Cash Out */}
          <View style={[styles.card, { backgroundColor: Colors.secondary + '12', borderColor: Colors.secondary }]}>
            <View style={[styles.tierBadge, { backgroundColor: Colors.secondary + '22', borderColor: Colors.secondary }]}>
              <Text style={{ fontSize: 8, color: Colors.secondary, fontWeight: '900' }}>💸 CASH OUT</Text>
            </View>
            <Ionicons name="cash" size={28} color={Colors.secondary} style={{ marginTop: 6, marginBottom: 6 }} />
            <Text style={[styles.itemName, { fontFamily: Typography.subheading, color: Colors.text }]}>₱10 Allowance</Text>
            <Text style={{ fontSize: 8, color: Colors.textDim, textAlign: 'center', fontFamily: Typography.body, marginBottom: 6 }}>Exchange tokens for real cash</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 }}>
              <Ionicons name="diamond" size={10} color={Colors.secondary} />
              <Text style={{ color: Colors.secondary, fontFamily: Typography.subheading, fontSize: 13 }}>100</Text>
            </View>
            <TouchableOpacity style={[styles.buyBtn, { backgroundColor: Colors.secondary }]} onPress={handleAllowanceExchange}>
              <Text style={[styles.buyBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Cash Out</Text>
            </TouchableOpacity>
          </View>

          {/* Daily System Rewards */}
          {renderShopSection('system')}
        </ScrollView>
      </ScrollView>

      {/* Gacha Modal */}
      <GachaModal visible={gachaOpen} onClose={() => setGachaOpen(false)} pool={buildGachaPool()} onSpin={handleSpin} />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, borderWidth: 1 },
  sectionTitle: { fontSize: 24 },
  badge: { minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { fontSize: 10 },
  divider: { height: 1, borderRadius: 1, marginVertical: 8 },
  emptyTier: { width: 200, padding: 20, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginRight: 12 },

  // Refresh banner
  refreshBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12, borderWidth: 1, marginBottom: 12 },

  // Cards
  card: { padding: 12, borderRadius: 20, marginRight: 10, width: 140, alignItems: 'center', borderWidth: 1.5, elevation: 2 },
  itemName: { fontSize: 12, textAlign: 'center', marginBottom: 2, height: 30 },
  saleTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginBottom: 4 },
  buyBtn: { paddingVertical: 9, width: '100%', borderRadius: 12, alignItems: 'center', elevation: 1 },
  buyBtnText: { fontSize: 12 },

  // Tier & stock badges
  tierBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, marginBottom: 2, alignSelf: 'flex-start' },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  // Gacha card
  gachaCard: { width: 150, borderWidth: 2, position: 'relative' },
  gachaBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  // Gacha Modal
  gachaOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  gachaSheet: { width: '100%', borderRadius: 30, padding: 24, elevation: 20 },
  gachaTitle: { fontSize: 22 },
  closeIcon: { padding: 6, borderRadius: 12 },
  rouletteWindow: { height: 86, borderRadius: 16, overflow: 'hidden', borderWidth: 2, marginBottom: 14, position: 'relative' },
  rouletteStrip: { flexDirection: 'row', position: 'absolute', top: 0, left: 0, height: '100%', alignItems: 'center' },
  rouletteItem: { height: 78, borderRadius: 12, marginHorizontal: 3, justifyContent: 'center', alignItems: 'center', borderWidth: 1, padding: 4 },
  rouletteIndicator: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, zIndex: 10, borderWidth: 1, borderStyle: 'dashed', opacity: 0.6 },
  resultBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, marginBottom: 14 },
  spinBtn: { flexDirection: 'row', padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinBtnText: { fontSize: 15 },
});