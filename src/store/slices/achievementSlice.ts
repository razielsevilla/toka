import { Alert } from 'react-native';
import { StateCreator } from 'zustand';
import { TokaState } from '../../types';

export const createAchievementSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'playDoubleOrNothing' | 'claimAchievement'
>> = (set, get) => ({
    // ── Actions ────────────────────────────────────────────────────────────────

    playDoubleOrNothing: (wager) => {
        const { currentUser, user, mockUsers } = get();
        const activeUser = currentUser || user;
        if (activeUser.tokens < wager || wager <= 0) return 'lose';

        const isWin = Math.random() >= 0.5;
        const tokenChange = isWin ? wager : -wager;
        const updatedUser = { ...activeUser, tokens: activeUser.tokens + tokenChange };

        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            transactions: [{
                id: `tx_minigame_${Date.now()}`,
                amount: Math.abs(tokenChange),
                type: isWin ? 'earn' : 'spend',
                reason: isWin ? 'Mini-game Win: Doubled!' : 'Mini-game Loss',
                timestamp: Date.now(),
            }, ...state.transactions],
            notifications: [{
                id: `notif_${Date.now()}`,
                type: 'achievement' as const,
                message: isWin
                    ? `${activeUser.name.split(' ')[0]} doubled ${wager} 💎 in Double or Nothing! 🎲`
                    : `${activeUser.name.split(' ')[0]} lost ${wager} 💎 in Double or Nothing.`,
                read: false, timestamp: Date.now(), targetRole: 'admin' as const,
            }, ...state.notifications],
        }));

        return isWin ? 'win' : 'lose';
    },

    claimAchievement: (achievementId, rewardTokens, badgeName) => {
        const { currentUser, user, mockUsers } = get();
        const activeUser = currentUser || user;
        if (activeUser.unlockedAchievements?.includes(achievementId)) return;

        const newUnlocked = [...(activeUser.unlockedAchievements || []), achievementId];
        const newBadges = badgeName && !activeUser.badges?.includes(badgeName)
            ? [...(activeUser.badges || []), badgeName]
            : activeUser.badges;

        const updatedUser = { ...activeUser, tokens: activeUser.tokens + rewardTokens, unlockedAchievements: newUnlocked, badges: newBadges };

        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            transactions: [{ id: `tx_ach_${Date.now()}`, amount: rewardTokens, type: 'earn', reason: 'Achievement Unlocked! 🏆', timestamp: Date.now() }, ...state.transactions],
            notifications: [{ id: `notif_${Date.now()}`, type: 'achievement' as const, message: `${activeUser.name.split(' ')[0]} unlocked an achievement and earned ${rewardTokens} 💎! 🏅`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));

        Alert.alert('Achievement Unlocked! 🏅', `You earned ${rewardTokens} 💎${badgeName ? ` and the '${badgeName}' badge!` : '!'}`);
    },
});
