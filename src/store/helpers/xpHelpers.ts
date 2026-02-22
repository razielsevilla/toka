// ─── XP & Badge Helpers ───────────────────────────────────────────────────────
// Centralises XP/level calculation and badge award logic that was previously
// duplicated in taskSlice and authSlice.

import {
    XP_PER_TOKEN, XP_PER_LEVEL,
    STREAK_MULT_7, STREAK_MULT_14, STREAK_MULT_30, STREAK_DISCOUNT,
    BADGE_RISING_STAR, BADGE_CHORE_MASTER,
} from '../../constants';
import type { User } from '../../types';

/** Returns the streak multiplier for `streak` consecutive days. */
export function getStreakMultiplier(streak: number): number {
    if (streak >= 30) return STREAK_MULT_30;
    if (streak >= 14) return STREAK_MULT_14;
    if (streak >= 7) return STREAK_MULT_7;
    return 1.0;
}

/** Returns true if this item is currently on an active flash sale. */
export function isFlashSaleActive(item: { saleUntil?: number; originalCost?: number }): boolean {
    return !!(item.saleUntil && item.originalCost && item.saleUntil > Date.now());
}

/** Returns the purchase cost after applying streak discount (if not on sale). */
export function getFinalCost(cost: number, streak: number, onSale: boolean): number {
    const discount = (!onSale && streak >= 7) ? STREAK_DISCOUNT : 1.0;
    return Math.floor(cost * discount);
}

export interface XpResult {
    newXp: number;
    newLevel: number;
    newBadges: string[];
}

/**
 * Calculates the new XP, level, and badge list after earning `tokensEarned`
 * tokens. Pass the user's current xp, level, and badges.
 */
export function calculateXpGains(
    tokensEarned: number,
    currentXp: number = 0,
    currentBadges: string[] = ['Seedling']
): XpResult {
    const newXp = currentXp + tokensEarned * XP_PER_TOKEN;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

    let newBadges = [...currentBadges];
    if (newLevel >= 2 && !newBadges.includes(BADGE_RISING_STAR)) newBadges.push(BADGE_RISING_STAR);
    if (newLevel >= 5 && !newBadges.includes(BADGE_CHORE_MASTER)) newBadges.push(BADGE_CHORE_MASTER);

    return { newXp, newLevel, newBadges };
}

/**
 * Applies XP/level/badge gains to a user object. Convenience wrapper
 * around `calculateXpGains` that returns a partial user patch.
 */
export function applyXpGains(user: User, tokensEarned: number): Partial<User> {
    const { newXp, newLevel, newBadges } = calculateXpGains(
        tokensEarned,
        user.xp,
        user.badges,
    );
    return { xp: newXp, level: newLevel, badges: newBadges };
}
