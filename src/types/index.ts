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
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  status: 'open' | 'accepted' | 'pending' | 'completed';
  type: 'regular' | 'spontaneous';
  frequency?: 'daily' | 'weekly' | 'monthly';
  assignedTo: string[]; // empty if spontaneous and not yet accepted
  proofUrl?: string;
  rejectionReason?: string; // Support rejectTask logic
  isWithdrawal?: boolean; // Flag withdrawal pseudo-tasks
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
  marketItems: { id: string; name: string; cost: number; type: string }[];
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
  addMember: (name: string, role: UserRole) => void;
  rejectTask: (taskId: string, reason: string) => void;
  addMarketItem: (item: { name: string; cost: number; type: string }) => void;
  removeMarketItem: (itemId: string) => void;
  clearNotifications: (type: 'task' | 'market' | 'rejection' | 'market_purchase') => void;
}