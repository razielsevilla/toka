// ─── App-Wide Constants ────────────────────────────────────────────────────────
// Single source of truth for all magic numbers and domain constants.
// Import from here instead of hard-coding values throughout the codebase.

// ── Economy ───────────────────────────────────────────────────────────────────
export const GACHA_COST = 40;        // Tokens to open a loot box
export const CASHOUT_AMOUNT = 100;       // Tokens to request ₱10 allowance cash-out
export const CASHOUT_PESO_VALUE = 10;        // Pesos received for CASHOUT_AMOUNT tokens
export const TOKEN_TO_PESO = 0.50;      // 1 token = ₱0.50
export const DEFAULT_MONTHLY_BUDGET = 500;  // ₱ parent monthly budget cap
export const STREAK_DISCOUNT = 0.9;       // 10% discount at ≥7 day streak

// ── XP & Levelling ────────────────────────────────────────────────────────────
export const XP_PER_TOKEN = 10;        // XP gained per token earned
export const XP_PER_LEVEL = 500;       // XP needed to advance one level

// ── Streak Multipliers ────────────────────────────────────────────────────────
export const STREAK_MULT_7 = 1.2;       // ≥ 7-day streak
export const STREAK_MULT_14 = 1.5;       // ≥ 14-day streak
export const STREAK_MULT_30 = 2.0;       // ≥ 30-day streak

// ── Time ──────────────────────────────────────────────────────────────────────
export const ONE_DAY_MS = 86_400_000;
export const ONE_HOUR_MS = 3_600_000;
export const ONE_MINUTE_MS = 60_000;

// ── Interest / Vault ──────────────────────────────────────────────────────────
export const DEFAULT_INTEREST_RATE = 0.05;  // 5% APY

// ── Shop ──────────────────────────────────────────────────────────────────────
export const SHOP_REFRESH_INTERVAL = ONE_DAY_MS;

// ── Badges ────────────────────────────────────────────────────────────────────
export const BADGE_RISING_STAR = 'Rising Star';   // Awarded at level 2
export const BADGE_CHORE_MASTER = 'Chore Master';  // Awarded at level 5
export const BADGE_SEEDLING = 'Seedling';       // Default starting badge

// ── Auction ───────────────────────────────────────────────────────────────────
export const AUCTION_SNIPING_BUFFER = 60;   // Seconds added if bid placed in last minute
