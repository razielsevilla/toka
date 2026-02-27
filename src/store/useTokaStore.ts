// ─── Root Store ───────────────────────────────────────────────────────────────
// This file is intentionally thin. All state and actions live in their
// respective slice files under ./slices/. This file just composes them.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokaState } from '../types';

import { createAuthSlice } from './slices/authSlice';
import { createTaskSlice } from './slices/taskSlice';
import { createMarketSlice } from './slices/marketSlice';
import { createVaultSlice } from './slices/vaultSlice';
import { createShopSlice } from './slices/shopSlice';
import { createAchievementSlice } from './slices/achievementSlice';
import { createNotificationSlice } from './slices/notificationSlice';

export const useTokaStore = create<TokaState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createTaskSlice(...a),
      ...createMarketSlice(...a),
      ...createVaultSlice(...a),
      ...createShopSlice(...a),
      ...createAchievementSlice(...a),
      ...createNotificationSlice(...a),
    }),
    {
      name: 'toka-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen to state changes to trigger push notifications
useTokaStore.subscribe((state, prevState) => {
  if (state.notifications.length > prevState.notifications.length) {
    const diffCount = state.notifications.length - prevState.notifications.length;
    // New notifications are unshifted to the front
    for (let i = 0; i < diffCount; i++) {
      const notif = state.notifications[i];

      // Let's filter pushes if it's meant for someone else, or just simulate it going through to the device.
      // As a prototype, we'll announce it for testing.
      const activeRole = state.currentUser?.role || state.user.role;
      const targetMatched = notif.targetRole === 'all' || notif.targetRole === activeRole;

      // Optionally, we could strictly enforce `targetMatched`, but for local simulation fun, we'll just push any that match our role
      if (targetMatched) {
        // Removing sendLocalNotification temporarily
        // sendLocalNotification('Toka Update ✨', notif.message);
      }
    }
  }
});