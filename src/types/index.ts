// src/types/index.ts

export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tokens: number;
  streak: number;
  householdId: string | null;
  password?: string; // Only for prototype logic
  wishlist: string[]; // Children's wishlist
  activeGoal?: { itemId: string; savedTokens: number };
  xp?: number;
  level?: number;
  badges?: string[];
  unlockedAchievements?: string[];
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  status: 'open' | 'accepted' | 'pending' | 'completed' | 'negotiating';
  type: 'regular' | 'spontaneous';
  frequency?: 'daily' | 'weekly' | 'monthly';
  assignedTo: string[]; // empty if spontaneous and not yet accepted
  proofUrl?: string;
  rejectionReason?: string; // Support rejectTask logic
  isWithdrawal?: boolean; // Flag withdrawal pseudo-tasks
  counterOfferAmount?: number;
  counterOfferReason?: string;
  proposedBy?: string;
  deadline?: number; // Timestamp for Dynamic Deadlines
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'task' | 'market' | 'rejection' | 'market_purchase';
  message: string;
  read: boolean;
  timestamp?: number;
}

export interface TokaState {
  // State
  user: User;
  tasks: Task[];
  transactions: Transaction[];
  marketItems: { id: string; name: string; cost: number; type: string; originalCost?: number; saleUntil?: number }[];
  auction: {
    itemName: string;
    highestBid: number;
    highestBidder: string | null;
    timeLeft: number; // in seconds
    isActive: boolean;
  };
  vaultBalance: number;
  interestRate: number;
  currentUser: User | null;
  mockUsers: User[];
  notifications: Notification[];
  bills: { id: string; title: string; amount: number; frequency: 'daily' | 'weekly' | 'monthly' }[];
  interestFrequency: 'daily' | 'weekly' | 'monthly';
  lastInterestApplied: number;
  conversionRate: number; // Real-world value of 1 token (e.g., 0.01 = 1 cent)
  monthlyBudget: number; // Maximum dollars allowed to distribute per month

  // Actions
  setRole: (role: UserRole) => void;
  generateInviteCode: () => string;
  joinHousehold: (code: string) => void;
  addTokens: (amount: number, reason: string) => number;
  submitTask: (taskId: string, proofUrl: string) => void;
  approveTask: (taskId: string) => void;
  purchaseItem: (itemId: string) => boolean;
  openMysteryBox: () => string;
  resetStreak: () => void;
  placeBid: (amount: number) => void;
  tickAuction: () => void;
  depositToVault: (amount: number) => void;
  withdrawFromVault: (amount: number) => void;
  applyInterest: () => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addTask: (taskData: Partial<Task>) => void;
  acceptTask: (taskId: string, userId: string) => void;
  setWishlistGoal: (itemId: string) => void;
  fundGoal: (amount: number) => void;
  addMember: (name: string, role: UserRole) => void;
  rejectTask: (taskId: string, reason: string) => void;
  addMarketItem: (item: { name: string; cost: number; type: string; originalCost?: number; saleUntil?: number }) => void;
  removeMarketItem: (itemId: string) => void;
  clearNotifications: (type: 'task' | 'market' | 'rejection' | 'market_purchase') => void;
  setInterestPolicy: (rate: number, frequency: 'daily' | 'weekly' | 'monthly') => void;
  setBudgetPolicy: (rate: number, budget: number) => void;
  addBill: (bill: { title: string; amount: number; frequency: 'daily' | 'weekly' | 'monthly' }) => void;
  removeBill: (billId: string) => void;
  processBills: () => void;
  submitCounterOffer: (taskId: string, userId: string, amount: number, reason: string) => void;
  acceptCounterOffer: (taskId: string) => void;
  rejectCounterOffer: (taskId: string, reason: string) => void;
  transferTokens: (toUserId: string, amount: number, memo: string) => void;
  playDoubleOrNothing: (wager: number) => 'win' | 'lose';
  claimAchievement: (achievementId: string, rewardTokens: number, badgeName?: string) => void;
}