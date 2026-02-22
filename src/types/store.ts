import type { User, UserRole } from './user';
import type { Task } from './task';
import type { Transaction, Bill } from './finance';
import type { MarketItem, Auction, DailyShop } from './market';
import type { Notification } from './notification';
import type { Frequency } from './task';

export interface TokaState {
    // ── State ──────────────────────────────────────────────────────────────────
    theme: 'light' | 'dark';
    user: User;
    currentUser: User | null;
    mockUsers: User[];
    activeTab: string;

    tasks: Task[];
    transactions: Transaction[];
    notifications: Notification[];
    bills: Bill[];

    marketItems: MarketItem[];
    auction: Auction;
    dailyShop: DailyShop;

    vaultBalance: number;
    interestRate: number;
    interestFrequency: Frequency;
    lastInterestApplied: number;
    conversionRate: number;
    monthlyBudget: number;

    // ── Auth Actions ───────────────────────────────────────────────────────────
    setTheme: (theme: 'light' | 'dark') => void;
    setActiveTab: (tab: string) => void;
    setRole: (role: UserRole) => void;
    generateInviteCode: () => string;
    joinHousehold: (code: string) => void;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    addMember: (name: string, role: UserRole) => void;

    // ── Task Actions ───────────────────────────────────────────────────────────
    addTokens: (amount: number, reason: string) => number;
    addTask: (taskData: Partial<Task>) => void;
    acceptTask: (taskId: string, userId: string) => void;
    submitTask: (taskId: string, proofUrl: string) => void;
    approveTask: (taskId: string) => void;
    rejectTask: (taskId: string, reason: string) => void;
    submitCounterOffer: (taskId: string, userId: string, amount: number, reason: string) => void;
    acceptCounterOffer: (taskId: string) => void;
    rejectCounterOffer: (taskId: string, reason: string) => void;

    // ── Market Actions ─────────────────────────────────────────────────────────
    purchaseItem: (itemId: string) => boolean;
    openMysteryBox: () => string;
    applyGachaPrize: (prizeLabel: string, bonusTokens: number) => boolean;
    addMarketItem: (item: Omit<MarketItem, 'id'>) => void;
    removeMarketItem: (itemId: string) => void;
    startAuction: (itemName: string, durationSeconds: number, startingBid: number) => void;
    placeBid: (amount: number) => void;
    tickAuction: () => void;
    setWishlistGoal: (itemId: string) => void;
    fundGoal: (amount: number) => void;

    // ── Vault Actions ──────────────────────────────────────────────────────────
    resetStreak: () => void;
    depositToVault: (amount: number) => void;
    withdrawFromVault: (amount: number) => void;
    requestAllowanceCashout: (amount: number) => void;
    applyInterest: () => void;
    setInterestPolicy: (rate: number, frequency: Frequency) => void;
    setBudgetPolicy: (rate: number, budget: number) => void;
    addBill: (bill: Omit<Bill, 'id'>) => void;
    removeBill: (billId: string) => void;
    processBills: () => void;
    transferTokens: (toUserId: string, amount: number, memo: string) => void;

    // ── Shop Actions ───────────────────────────────────────────────────────────
    refreshDailyShop: () => void;
    buyShopItem: (itemId: string) => boolean;

    // ── Achievement Actions ────────────────────────────────────────────────────
    claimAchievement: (achievementId: string, rewardTokens: number, badgeName?: string) => void;
    playDoubleOrNothing: (wager: number) => 'win' | 'lose';

    // ── Notification Actions ───────────────────────────────────────────────────
    clearNotifications: (type: Notification['type']) => void;
    clearAllNotifications: () => void;
    markNotificationAsRead: (notifId: string) => void;
}
