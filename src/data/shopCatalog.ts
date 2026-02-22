// ─── Master Shop Catalog ──────────────────────────────────────────────────────
// This is the full pool from which the daily rotating shop draws items.
// Tier rules (applied at refresh time):
//   common     → all appear every day,  stock 6-10,  24h window
//   uncommon   → 70% chance each day,   stock 3-5,   24h window
//   rare       → 30% chance each day,   stock 1-3,   12h window
//   legendary  → 10% chance per day,    stock 1,      4h window

export type ShopTier = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface CatalogItem {
    id: string;
    name: string;
    cost: number;
    icon: string;
    desc: string;
    tier: ShopTier;
    category: 'merch' | 'system';
    maxStock: number;
    windowHours: number; // hours the slot is valid from the moment of refresh
}

// ─── Toka Merchandise ─────────────────────────────────────────────────────────

export const MERCH_CATALOG: CatalogItem[] = [
    // ── Common ────────────────────────────────────────────────────────────────
    { id: 'merch_sticker', name: 'Toka Sticker Pack', cost: 80, icon: 'pricetag', desc: 'Holographic Toka stickers (5-pack)', tier: 'common', category: 'merch', maxStock: 10, windowHours: 24 },
    { id: 'merch_pin', name: 'Toka Pin Badge', cost: 60, icon: 'disc', desc: 'Enamel pin badge with Toka mascot', tier: 'common', category: 'merch', maxStock: 8, windowHours: 24 },
    { id: 'merch_bookmark', name: 'Bookmark Set', cost: 40, icon: 'bookmark', desc: 'Set of 3 illustrated Toka bookmarks', tier: 'common', category: 'merch', maxStock: 10, windowHours: 24 },
    { id: 'merch_keychain', name: 'Toka Keychain', cost: 75, icon: 'key', desc: 'Metal keychain with Toka charm', tier: 'common', category: 'merch', maxStock: 8, windowHours: 24 },
    // ── Uncommon ──────────────────────────────────────────────────────────────
    { id: 'merch_tote', name: 'Toka Tote Bag', cost: 250, icon: 'bag', desc: 'Eco-friendly canvas tote with logo', tier: 'uncommon', category: 'merch', maxStock: 5, windowHours: 24 },
    { id: 'merch_notebook', name: 'Toka Notebook', cost: 150, icon: 'book', desc: 'Premium A5 lined notebook', tier: 'uncommon', category: 'merch', maxStock: 5, windowHours: 24 },
    { id: 'merch_bottle', name: 'Toka Water Bottle', cost: 300, icon: 'water', desc: 'Stainless insulated bottle (500ml)', tier: 'uncommon', category: 'merch', maxStock: 4, windowHours: 24 },
    { id: 'merch_lanyard', name: 'Toka Lanyard', cost: 100, icon: 'link', desc: 'Official woven polyester lanyard', tier: 'uncommon', category: 'merch', maxStock: 6, windowHours: 24 },
    { id: 'merch_mousepad', name: 'Toka Mouse Pad', cost: 180, icon: 'grid', desc: 'XL desk mat with Toka artwork', tier: 'uncommon', category: 'merch', maxStock: 4, windowHours: 24 },
    // ── Rare ──────────────────────────────────────────────────────────────────
    { id: 'merch_cap', name: 'Toka Cap 🧢', cost: 350, icon: 'shirt', desc: 'Premium embroidered structured cap', tier: 'rare', category: 'merch', maxStock: 3, windowHours: 12 },
    { id: 'merch_hoodie', name: 'Toka Hoodie', cost: 800, icon: 'shirt', desc: 'Premium cotton blend hoodie (limited run)', tier: 'rare', category: 'merch', maxStock: 2, windowHours: 12 },
    { id: 'merch_backpack', name: 'Toka Backpack', cost: 600, icon: 'briefcase', desc: '20L school backpack with hidden pocket', tier: 'rare', category: 'merch', maxStock: 2, windowHours: 12 },
    { id: 'merch_tumbler', name: 'Toka Tumbler', cost: 450, icon: 'cafe', desc: 'Double-walled glass tumbler w/ lid', tier: 'rare', category: 'merch', maxStock: 3, windowHours: 12 },
    { id: 'merch_tshirt', name: 'Toka T-Shirt', cost: 500, icon: 'shirt', desc: 'Premium graphic tee (limited colourway)', tier: 'rare', category: 'merch', maxStock: 2, windowHours: 12 },
    // ── Legendary ─────────────────────────────────────────────────────────────
    { id: 'merch_bundle', name: 'Toka Legend Bundle ✨', cost: 1500, icon: 'gift', desc: 'Cap + Hoodie + Sticker + Exclusive Patch', tier: 'legendary', category: 'merch', maxStock: 1, windowHours: 4 },
    { id: 'merch_signed', name: 'Signed Collector Set', cost: 2000, icon: 'trophy', desc: 'Hand-signed exclusive collector edition', tier: 'legendary', category: 'merch', maxStock: 1, windowHours: 4 },
];

// ─── System Rewards ───────────────────────────────────────────────────────────

export const SYSTEM_CATALOG: CatalogItem[] = [
    // ── Common ────────────────────────────────────────────────────────────────
    { id: 'sys_screen5', name: '+5 Min Screen Time', cost: 20, icon: 'phone-portrait', desc: 'Bonus screen time coupon', tier: 'common', category: 'system', maxStock: 8, windowHours: 24 },
    { id: 'sys_skip1', name: 'Skip 1 Chore Pass', cost: 40, icon: 'checkmark-done', desc: 'Skip one assigned chore, guilt-free', tier: 'common', category: 'system', maxStock: 5, windowHours: 24 },
    { id: 'sys_tokens10', name: '10 Bonus Tokens', cost: 15, icon: 'diamond', desc: 'Instant token top-up', tier: 'common', category: 'system', maxStock: 10, windowHours: 24 },
    { id: 'sys_avatar_basic', name: 'Default Avatar Frame', cost: 30, icon: 'person-circle', desc: 'Simple coloured frame for your avatar', tier: 'common', category: 'system', maxStock: 10, windowHours: 24 },
    { id: 'sys_screen10', name: '+10 Min Screen Time', cost: 35, icon: 'phone-portrait', desc: 'Double screen-time coupon', tier: 'common', category: 'system', maxStock: 6, windowHours: 24 },
    // ── Uncommon ──────────────────────────────────────────────────────────────
    { id: 'sys_avatar_hat', name: 'Cool Avatar Hat 🎩', cost: 80, icon: 'happy', desc: 'Stylish in-app cosmetic hat', tier: 'uncommon', category: 'system', maxStock: 6, windowHours: 24 },
    { id: 'sys_shield3', name: 'Streak Shield ×3', cost: 60, icon: 'shield-checkmark', desc: 'Protect 3 streak days from breaking', tier: 'uncommon', category: 'system', maxStock: 5, windowHours: 24 },
    { id: 'sys_xp15', name: 'XP Booster 1.5×', cost: 80, icon: 'rocket', desc: 'Earn 1.5× XP for the next 5 chores', tier: 'uncommon', category: 'system', maxStock: 4, windowHours: 24 },
    { id: 'sys_tokens30', name: '30 Bonus Tokens', cost: 40, icon: 'diamond', desc: 'Solid token boost', tier: 'uncommon', category: 'system', maxStock: 5, windowHours: 24 },
    { id: 'sys_silver_frame', name: 'Silver Avatar Frame', cost: 100, icon: 'medal', desc: 'Shiny silver border for your profile', tier: 'uncommon', category: 'system', maxStock: 4, windowHours: 24 },
    { id: 'sys_skip2', name: 'Skip 2 Chore Pass', cost: 75, icon: 'checkmark-done', desc: 'Skip two assigned chores', tier: 'uncommon', category: 'system', maxStock: 3, windowHours: 24 },
    // ── Rare ──────────────────────────────────────────────────────────────────
    { id: 'sys_shield7', name: 'Streak Shield ×7', cost: 140, icon: 'shield', desc: 'Full week of streak protection', tier: 'rare', category: 'system', maxStock: 2, windowHours: 12 },
    { id: 'sys_xp2', name: 'XP Booster 2×', cost: 180, icon: 'rocket', desc: 'Double XP for the next 10 chores', tier: 'rare', category: 'system', maxStock: 2, windowHours: 12 },
    { id: 'sys_gold_frame', name: 'Gold Avatar Frame 🥇', cost: 200, icon: 'medal', desc: 'Rare gold border — very few get this', tier: 'rare', category: 'system', maxStock: 2, windowHours: 12 },
    { id: 'sys_weekend_pass', name: 'Weekend Pass ☀️', cost: 300, icon: 'sunny', desc: 'Skip all weekend chores (parent confirms)', tier: 'rare', category: 'system', maxStock: 1, windowHours: 12 },
    { id: 'sys_tokens100', name: '100 Bonus Tokens 💰', cost: 120, icon: 'diamond', desc: 'Massive token injection straight to your wallet', tier: 'rare', category: 'system', maxStock: 2, windowHours: 12 },
    { id: 'sys_screen30', name: '+30 Min Screen Time', cost: 100, icon: 'phone-portrait', desc: 'Large screen-time bonus', tier: 'rare', category: 'system', maxStock: 2, windowHours: 12 },
    // ── Legendary ─────────────────────────────────────────────────────────────
    { id: 'sys_no_chores', name: 'No Chores for a Week 🌟', cost: 500, icon: 'star', desc: 'LEGENDARY: Full week off all chores', tier: 'legendary', category: 'system', maxStock: 1, windowHours: 4 },
    { id: 'sys_xp3', name: 'ULTIMATE XP Booster 3×', cost: 400, icon: 'flash', desc: 'LEGENDARY: Triple XP for 20 chores', tier: 'legendary', category: 'system', maxStock: 1, windowHours: 4 },
    { id: 'sys_diamond_frame', name: 'Diamond Frame 💎', cost: 500, icon: 'diamond', desc: 'LEGENDARY: The rarest cosmetic in Toka', tier: 'legendary', category: 'system', maxStock: 1, windowHours: 4 },
    { id: 'sys_family_event', name: 'Family Fun Night 🎉', cost: 600, icon: 'people', desc: 'LEGENDARY: Whole family picks an activity', tier: 'legendary', category: 'system', maxStock: 1, windowHours: 4 },
];

// ─── Tier Metadata ────────────────────────────────────────────────────────────

export const TIER_META: Record<ShopTier, { color: string; label: string; emoji: string; chancePct: number }> = {
    common: { color: '#94A3B8', label: 'Common', emoji: '📦', chancePct: 100 },
    uncommon: { color: '#10B981', label: 'Uncommon', emoji: '🎁', chancePct: 70 },
    rare: { color: '#818CF8', label: 'Rare', emoji: '💎', chancePct: 30 },
    legendary: { color: '#F59E0B', label: 'Legendary', emoji: '🌟', chancePct: 10 },
};

// ─── Refresh Logic ────────────────────────────────────────────────────────────
// Picks items from the catalog for a fresh 24-hour shop window.

export interface ShopSlot {
    itemId: string;
    stock: number;
    expiresAt: number; // ms timestamp
}

function pickByTier(catalog: CatalogItem[], tier: ShopTier, now: number, maxPicks: number): ShopSlot[] {
    const pool = catalog.filter(i => i.tier === tier);
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxPicks).map(item => ({
        itemId: item.id,
        stock: item.maxStock,
        expiresAt: now + item.windowHours * 3600 * 1000,
    }));
}

export function generateDailyShop(now: number): ShopSlot[] {
    const slots: ShopSlot[] = [];
    const allCatalog = [...MERCH_CATALOG, ...SYSTEM_CATALOG];

    // Common: all appear
    allCatalog.filter(i => i.tier === 'common').forEach(item => {
        slots.push({ itemId: item.id, stock: item.maxStock, expiresAt: now + 24 * 3600 * 1000 });
    });

    // Uncommon: 70% chance each, up to 6 total per category
    for (const category of ['merch', 'system'] as const) {
        const pool = allCatalog.filter(i => i.tier === 'uncommon' && i.category === category);
        pool.sort(() => Math.random() - 0.5).slice(0, 4).forEach(item => {
            if (Math.random() < 0.70) {
                slots.push({ itemId: item.id, stock: item.maxStock, expiresAt: now + 24 * 3600 * 1000 });
            }
        });
    }

    // Rare: 30% chance each, up to 2 per category, 12h window
    for (const category of ['merch', 'system'] as const) {
        const pool = allCatalog.filter(i => i.tier === 'rare' && i.category === category);
        pool.sort(() => Math.random() - 0.5).slice(0, 3).forEach(item => {
            if (Math.random() < 0.30) {
                slots.push({ itemId: item.id, stock: item.maxStock, expiresAt: now + 12 * 3600 * 1000 });
            }
        });
    }

    // Legendary: 10% chance, max 1 per category, 4h window
    for (const category of ['merch', 'system'] as const) {
        if (Math.random() < 0.10) {
            const pool = allCatalog.filter(i => i.tier === 'legendary' && i.category === category);
            const pick = pool[Math.floor(Math.random() * pool.length)];
            if (pick) {
                slots.push({ itemId: pick.id, stock: pick.maxStock, expiresAt: now + 4 * 3600 * 1000 });
            }
        }
    }

    return slots;
}
