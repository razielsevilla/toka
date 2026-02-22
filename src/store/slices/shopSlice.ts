import { Alert } from 'react-native';
import { StateCreator } from 'zustand';
import { TokaState } from '../../types';
import { generateDailyShop, MERCH_CATALOG, SYSTEM_CATALOG } from '../../data/shopCatalog';

export const createShopSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'dailyShop'
    | 'refreshDailyShop' | 'buyShopItem'
>> = (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    dailyShop: { lastRefresh: 0, slots: [] },

    // ── Actions ────────────────────────────────────────────────────────────────

    refreshDailyShop: () => {
        const { dailyShop } = get();
        const now = Date.now();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        if (now - dailyShop.lastRefresh < TWENTY_FOUR_HOURS && dailyShop.slots.length > 0) return;
        set({ dailyShop: { lastRefresh: now, slots: generateDailyShop(now) } });
    },

    buyShopItem: (itemId) => {
        const { dailyShop, currentUser, user } = get();
        const activeUser = currentUser || user;
        const now = Date.now();

        const slotIndex = dailyShop.slots.findIndex(s => s.itemId === itemId);
        if (slotIndex === -1) { Alert.alert('Item Unavailable', 'This item is no longer in the shop.'); return false; }
        const slot = dailyShop.slots[slotIndex];
        if (now > slot.expiresAt) { Alert.alert('Expired', 'This item window has closed! Check back tomorrow.'); return false; }
        if (slot.stock <= 0) { Alert.alert('Sold Out', 'This item is sold out for today!'); return false; }

        const allCatalog = [...MERCH_CATALOG, ...SYSTEM_CATALOG];
        const item = allCatalog.find(i => i.id === itemId);
        if (!item) return false;

        if (activeUser.tokens < item.cost) {
            Alert.alert('Not Enough Tokens', `You need ${item.cost} 💎 but only have ${activeUser.tokens} 💎.`);
            return false;
        }

        const bonusTokens = item.id.includes('tokens') ? parseInt(item.name.match(/\d+/)?.[0] || '0', 10) : 0;
        const updatedUser = { ...activeUser, tokens: activeUser.tokens - item.cost + bonusTokens };
        const updatedSlots = dailyShop.slots.map((s, i) => i === slotIndex ? { ...s, stock: s.stock - 1 } : s);

        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            dailyShop: { ...state.dailyShop, slots: updatedSlots },
            transactions: [
                { id: `shop_${Date.now()}`, amount: item.cost, type: 'spend' as const, reason: `Shop: ${item.name}`, timestamp: Date.now() },
                ...(bonusTokens > 0 ? [{ id: `shop_bonus_${Date.now()}`, amount: bonusTokens, type: 'earn' as const, reason: `Shop Win: ${item.name}`, timestamp: Date.now() }] : []),
                ...state.transactions,
            ],
            notifications: [{
                id: `notif_shop_${Date.now()}`,
                type: 'market_purchase' as const,
                message: `${activeUser.name.split(' ')[0]} bought "${item.name}" from the shop!`,
                read: false, timestamp: Date.now(), targetRole: 'admin' as const,
            }, ...state.notifications],
        }));

        Alert.alert('Purchased! 🎉', `You got: ${item.name}${bonusTokens > 0 ? `\n+${bonusTokens} tokens added to your wallet!` : ''}`);
        return true;
    },
});
