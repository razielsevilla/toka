import { Alert } from 'react-native';
import { StateCreator } from 'zustand';
import { Notification, TokaState } from '../../types';

export const createMarketSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'marketItems' | 'auction' | 'transactions'
    | 'purchaseItem' | 'openMysteryBox' | 'applyGachaPrize'
    | 'addMarketItem' | 'removeMarketItem'
    | 'startAuction' | 'placeBid' | 'tickAuction'
    | 'setWishlistGoal' | 'fundGoal'
>> = (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    transactions: [],

    marketItems: [
        { id: 'm1', name: '30 Mins Screen Time', cost: 50, type: 'voucher' },
        { id: 'm2', name: 'Pizza Night', cost: 200, type: 'real-world' },
    ],

    auction: {
        itemName: 'Family Trip to the Theme Park',
        highestBid: 100,
        highestBidder: null,
        timeLeft: 300,
        isActive: false,
    },

    // ── Actions ────────────────────────────────────────────────────────────────

    purchaseItem: (itemId) => {
        const { marketItems, currentUser, user } = get();
        const activeUser = currentUser || user;
        const item = marketItems.find(i => i.id === itemId);
        if (!item) return false;

        const isOnSale = !!(item.saleUntil && item.originalCost && item.saleUntil > Date.now());
        const discount = (!isOnSale && activeUser.streak >= 7) ? 0.9 : 1.0;
        const finalCost = Math.floor(item.cost * discount);

        const isGoal = activeUser.activeGoal?.itemId === itemId;
        const goalSaved = isGoal && activeUser.activeGoal ? activeUser.activeGoal.savedTokens : 0;

        if ((activeUser.tokens + goalSaved) < finalCost) {
            Alert.alert('Insufficient Tokens', `You need ${finalCost} 💎 for this reward. Keep doing those chores!`);
            return false;
        }

        let newTokens = activeUser.tokens;
        let newGoal = activeUser.activeGoal;
        if (isGoal) {
            newTokens = goalSaved >= finalCost ? newTokens + (goalSaved - finalCost) : newTokens - (finalCost - goalSaved);
            newGoal = undefined;
        } else {
            newTokens -= finalCost;
        }

        const updatedUser = { ...activeUser, tokens: newTokens, activeGoal: newGoal };
        const newNotif: Notification = { id: `notif_${Date.now()}`, type: 'market_purchase', message: `${activeUser.name.split(' ')[0]} just claimed: ${item.name}!`, read: false, timestamp: Date.now(), targetRole: 'admin' };

        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            notifications: [newNotif, ...state.notifications],
            transactions: [{ id: `tx_${Date.now()}`, amount: finalCost, type: 'spend', reason: `Bought: ${item.name}`, timestamp: Date.now() }, ...state.transactions],
        }));
        Alert.alert('Reward Claimed! 🎉', `You exchanged ${finalCost} 💎 for ${item.name}.`);
        return true;
    },

    openMysteryBox: () => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        const cost = 40;
        if (activeUser.tokens < cost) return 'Insufficient Tokens';
        const prizes = [
            { weight: 2, label: '🌟 LEGENDARY: ₱50 Allowance Cash Out!', tokens: 0 },
            { weight: 3, label: '🌟 LEGENDARY: No Chores for 2 Days!', tokens: 0 },
            { weight: 10, label: '💎 RARE: XP Booster 3× (10 Chores)', tokens: 0 },
            { weight: 10, label: '💎 RARE: Streak Shield ×5', tokens: 0 },
            { weight: 15, label: '🎁 UNCOMMON: 50 Bonus Tokens', tokens: 50 },
            { weight: 15, label: '🎁 UNCOMMON: Toka Sticker Pack', tokens: 0 },
            { weight: 25, label: '📦 COMMON: 20 Bonus Tokens', tokens: 20 },
            { weight: 20, label: '📦 COMMON: 10 Bonus Tokens', tokens: 10 },
        ];
        const total = prizes.reduce((s, p) => s + p.weight, 0);
        let roll = Math.random() * total;
        let prize = prizes[prizes.length - 1];
        for (const p of prizes) { roll -= p.weight; if (roll <= 0) { prize = p; break; } }
        const updatedUser = { ...activeUser, tokens: activeUser.tokens - cost + prize.tokens };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            transactions: [
                { id: `gbox_${Date.now()}`, amount: cost, type: 'spend', reason: `Gacha Box: ${prize.label}`, timestamp: Date.now() },
                ...(prize.tokens > 0 ? [{ id: `gbox_win_${Date.now()}`, amount: prize.tokens, type: 'earn' as const, reason: `Gacha Win: ${prize.label}`, timestamp: Date.now() }] : []),
                ...state.transactions,
            ],
            notifications: [{ id: `notif_${Date.now()}`, type: 'achievement' as const, message: `${activeUser.name.split(' ')[0]} opened a Loot Box and got: ${prize.label}!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
        return prize.label;
    },

    applyGachaPrize: (prizeLabel, bonusTokens) => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        const cost = 40;
        if (activeUser.tokens < cost) return false;
        const updatedUser = { ...activeUser, tokens: activeUser.tokens - cost + bonusTokens };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            transactions: [
                { id: `gacha_cost_${Date.now()}`, amount: cost, type: 'spend' as const, reason: `Gacha Box: ${prizeLabel}`, timestamp: Date.now() },
                ...(bonusTokens > 0 ? [{ id: `gacha_win_${Date.now()}`, amount: bonusTokens, type: 'earn' as const, reason: `Gacha Win: ${prizeLabel}`, timestamp: Date.now() }] : []),
                ...state.transactions,
            ],
            notifications: [{ id: `notif_gacha_${Date.now()}`, type: 'achievement' as const, message: `${activeUser.name.split(' ')[0]} opened a Loot Box and got: ${prizeLabel}!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
        return true;
    },

    addMarketItem: (item) => {
        const newItem = { ...item, id: `m_${Date.now()}` };
        set((state) => ({
            marketItems: [...state.marketItems, newItem],
            notifications: [{ id: `notif_${Date.now()}`, type: 'market' as const, message: 'New reward in the market!', read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
        }));
        Alert.alert('Market Updated', `${item.name} is now available for the kids!`);
    },

    removeMarketItem: (itemId) => {
        set((state) => ({ marketItems: state.marketItems.filter(i => i.id !== itemId) }));
    },

    startAuction: (itemName, durationSeconds, startingBid) => {
        set((state) => ({
            auction: { itemName, highestBid: startingBid, highestBidder: null, timeLeft: durationSeconds, isActive: true },
            notifications: [{ id: `notif_${Date.now()}`, type: 'market' as const, message: `Auction started! Bid on: "${itemName}" — starting at ${startingBid} 💎`, read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
        }));
        Alert.alert('Auction Started', `${itemName} is now up for auction!`);
    },

    placeBid: (amount) => {
        const { auction, currentUser, user } = get();
        const activeUser = currentUser || user;
        if (!auction.isActive) { Alert.alert('Auction Inactive', 'The auction is not currently active.'); return; }
        if (amount <= auction.highestBid) { Alert.alert('Low Bid', 'You must bid higher than the current price!'); return; }
        if (activeUser.tokens < amount) { Alert.alert('Insufficient Funds', "You don't have enough tokens for this bid!"); return; }
        const newTime = auction.timeLeft < 60 ? 60 : auction.timeLeft;
        set((state) => ({
            auction: { ...state.auction, highestBid: amount, highestBidder: activeUser.name, timeLeft: newTime },
            notifications: [{ id: `notif_${Date.now()}`, type: 'market' as const, message: `${activeUser.name.split(' ')[0]} placed a bid of ${amount} 💎 on "${auction.itemName}"!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
    },

    tickAuction: () => {
        const { auction } = get();
        if (!auction.isActive || auction.timeLeft <= 0) return;
        const newTimeLeft = auction.timeLeft - 1;
        set((state) => ({ auction: { ...state.auction, timeLeft: newTimeLeft, isActive: newTimeLeft > 0 } }));
        if (newTimeLeft === 0) Alert.alert('AUCTION ENDED!', `${auction.highestBidder ?? 'No one'} won the ${auction.itemName}!`);
    },

    setWishlistGoal: (itemId) => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        if (activeUser.activeGoal?.itemId === itemId) return;
        const refunded = activeUser.activeGoal?.savedTokens || 0;
        const newWishlist = activeUser.wishlist.includes(itemId) ? activeUser.wishlist : [...activeUser.wishlist, itemId];
        const updatedUser = { ...activeUser, wishlist: newWishlist, tokens: activeUser.tokens + refunded, activeGoal: { itemId, savedTokens: 0 } };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            ...(refunded > 0 ? { transactions: [{ id: `refund_${Date.now()}`, amount: refunded, type: 'earn' as const, reason: 'Goal Refunded', timestamp: Date.now() }, ...state.transactions] } : {}),
        }));
    },

    fundGoal: (amount) => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        if (!activeUser.activeGoal || amount <= 0 || activeUser.tokens < amount) {
            Alert.alert('Invalid Amount', "You don't have enough tokens!");
            return;
        }
        const updatedUser = { ...activeUser, tokens: activeUser.tokens - amount, activeGoal: { ...activeUser.activeGoal, savedTokens: activeUser.activeGoal.savedTokens + amount } };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            transactions: [{ id: `goal_${Date.now()}`, amount, type: 'spend', reason: 'Deposited to Goal', timestamp: Date.now() }, ...state.transactions],
            notifications: [{ id: `notif_${Date.now()}`, type: 'transfer' as const, message: `${activeUser.name.split(' ')[0]} put ${amount} 💎 toward their savings goal!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
    },
});
