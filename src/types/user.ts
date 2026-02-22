export type UserRole = 'admin' | 'member';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    tokens: number;
    streak: number;
    householdId: string | null;
    password?: string;
    wishlist: string[];
    activeGoal?: { itemId: string; savedTokens: number };
    xp?: number;
    level?: number;
    badges?: string[];
    unlockedAchievements?: string[];
}
