// ─── User Update Helper ───────────────────────────────────────────────────────
// Eliminates the repeated pattern of updating user, currentUser, and mockUsers
// simultaneously across every slice action.

import type { User } from '../../types';

type UserPatch = Partial<User>;

interface UserUpdateResult {
    user: (prev: User) => User;
    currentUser: (prev: User | null) => User | null;
    mockUsers: (prev: User[]) => User[];
}

/**
 * Returns a set of state updaters that apply `patch` to all three user
 * representations consistently. Use inside a `set((state) => ...)` call.
 *
 * @example
 * set((state) => ({
 *   ...applyUserUpdate(activeUser.id, { tokens: newTokens })(state),
 *   transactions: [...],
 * }));
 */
export function applyUserUpdate(userId: string, patch: UserPatch) {
    return (state: { user: User; currentUser: User | null; mockUsers: User[] }) => ({
        user: state.user.id === userId
            ? { ...state.user, ...patch }
            : state.user,
        currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, ...patch }
            : state.currentUser,
        mockUsers: state.mockUsers.map(u =>
            u.id === userId ? { ...u, ...patch } : u
        ),
    });
}
