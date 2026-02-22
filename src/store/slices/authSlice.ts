import { StateCreator } from 'zustand';
import { TokaState } from '../../types';

export const createAuthSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'theme' | 'user' | 'currentUser' | 'mockUsers' | 'activeTab'
    | 'setTheme' | 'setActiveTab' | 'setRole' | 'generateInviteCode'
    | 'joinHousehold' | 'login' | 'logout' | 'addMember'
>> = (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    theme: 'light' as const,
    activeTab: 'profile',

    user: {
        id: 'user_01',
        name: 'Toka Member',
        role: 'member',
        tokens: 0,
        streak: 0,
        householdId: null,
        wishlist: [],
        xp: 0,
        level: 1,
        badges: ['Seedling'],
        unlockedAchievements: [],
    },

    currentUser: null,

    mockUsers: [
        { id: 'u_parent', name: 'Mom (Admin)', role: 'admin', tokens: 0, streak: 0, householdId: 'house_123', password: '123', wishlist: [], unlockedAchievements: [] },
        { id: 'u_child', name: 'Raziel (Member)', role: 'member', tokens: 150, streak: 5, householdId: 'house_123', password: '123', wishlist: [], xp: 450, level: 1, badges: ['Seedling', 'First Chore!'], unlockedAchievements: [] },
    ],

    // ── Actions ────────────────────────────────────────────────────────────────

    setTheme: (theme) => set({ theme }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    setRole: (role) => set((state) => ({ user: { ...state.user, role } })),

    generateInviteCode: () => Math.random().toString(36).substring(2, 8).toUpperCase(),

    joinHousehold: (code) => {
        set((state) => {
            const activeUser = state.currentUser || state.user;
            const updatedUser = { ...activeUser, householdId: `house_${code}` };
            return {
                user: updatedUser,
                currentUser: updatedUser,
                mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            };
        });
    },

    login: (email, pass) => {
        const { mockUsers } = get();
        const found = mockUsers.find(
            u => u.name.toLowerCase().includes(email.toLowerCase()) && u.password === pass
        );
        if (found) {
            set({ user: found, currentUser: found, activeTab: 'profile' });
            return true;
        }
        return false;
    },

    logout: () => set({ currentUser: null, activeTab: 'profile' }),

    addMember: (name, role) => {
        const { Alert } = require('react-native');
        const { user, mockUsers } = get();
        if (user.role !== 'admin') {
            Alert.alert('Permission Denied', 'Only parents/admins can add new members.');
            return;
        }
        const newUser = {
            id: `u_${Date.now()}`,
            name, role,
            tokens: 0, streak: 0,
            householdId: user.householdId,
            password: '123',
            wishlist: [],
            unlockedAchievements: [],
        };
        set({ mockUsers: [...mockUsers, newUser] });
        Alert.alert('Success', `${name} has been added as a ${role}!`);
    },
});
