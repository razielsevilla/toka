import { StateCreator } from 'zustand';
import { TokaState } from '../../types';

export const createNotificationSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'notifications'
    | 'clearNotifications' | 'markNotificationAsRead' | 'clearAllNotifications'
>> = (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    notifications: [],

    // ── Actions ────────────────────────────────────────────────────────────────

    clearNotifications: (type) => {
        const role = get().currentUser?.role || get().user.role;
        set((state) => ({
            notifications: state.notifications.filter(
                n => !(n.type === type && (n.targetRole === role || n.targetRole === 'all'))
            ),
        }));
    },

    markNotificationAsRead: (notifId) => {
        set((state) => ({
            notifications: state.notifications.map(n =>
                n.id === notifId ? { ...n, read: true } : n
            ),
        }));
    },

    clearAllNotifications: () => {
        const role = get().currentUser?.role || get().user.role;
        set((state) => ({
            notifications: state.notifications.filter(
                n => !(n.targetRole === role || n.targetRole === 'all')
            ),
        }));
    },
});
