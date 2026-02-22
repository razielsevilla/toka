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