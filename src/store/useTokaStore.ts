import { Alert } from 'react-native';
import { create } from 'zustand';

// --- TYPES & INTERFACES ---

export type UserRole = 'admin' | 'member';

interface User {
  id: string;
  name: string;
  role: UserRole;
  tokens: number;
  streak: number;
  householdId: string | null;
  password?: string; // Only for prototype logic
}

interface Task {
  id: string;
  title: string;
  reward: number;
  status: 'open' | 'pending' | 'completed';
  assignedTo: string[]; // Supports "Team-Up" logic
  proofUrl?: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: number;
}

interface TokaState {
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
}

// --- THE STORE ENGINE ---

export const useTokaStore = create<TokaState>((set, get) => ({
  // Initial Mock State
  user: {
    id: 'user_01',
    name: 'Toka Member',
    role: 'member',
    tokens: 0,
    streak: 0,
    householdId: null,
  },
  tasks: [
    { id: '1', title: 'Wash the Dishes', reward: 20, status: 'open', assignedTo: [] },
    { id: '2', title: 'Clean the Backyard', reward: 50, status: 'open', assignedTo: [] },
    { id: '3',  title: 'Clean the Garage (Team-Up)', reward: 100, status: 'open', assignedTo: ['user_01', 'sibling_01'] },
  ],
  transactions: [],
  marketItems: [
    { id: 'm1', name: '30 Mins Screen Time', cost: 50, type: 'voucher' },
    { id: 'm2', name: 'Pizza Night', cost: 200, type: 'real-world' },
    { id: 'm3', name: 'Cool Avatar Hat', cost: 30, type: 'in-app' },
  ],
  auction: {
    itemName: 'Family Trip to the Theme Park',
    highestBid: 100,
    highestBidder: null,
    timeLeft: 300,
    isActive: true,
  },
  vaultBalance: 0,
  interestRate: 0.05,
  currentUser: null,
  mockUsers: [
    { id: 'u_parent', name: 'Mom (Admin)', role: 'admin', tokens: 0, streak: 0, householdId: 'house_123', password: '123' },
    { id: 'u_child', name: 'Raziel (Member)', role: 'member', tokens: 150, streak: 5, householdId: 'house_123', password: '123' },
  ],

  // --- ACTIONS ---

  setRole: (role) => set((state) => ({ user: { ...state.user, role } })),

  generateInviteCode: () => {
    // Generates a unique 6-character code (CS: Random String Generation)
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },

  joinHousehold: (code) => {
    set((state) => ({ user: { ...state.user, householdId: `house_${code}` } }));
    console.log(`Joined household: house_${code}`);
  },

  addTokens: (amount, reason) => {
    const { user } = get();

    let multiplier = 1.0;
    if (user.streak >= 7) multiplier = 1.2;
    if (user.streak >= 14) multiplier = 1.5;
    if (user.streak >= 30) multiplier = 2.0;

    const finalAmount = Math.floor(amount * multiplier);

    set((state) => ({
      user: { ...state.user, tokens: state.user.tokens + finalAmount },
      transactions: [
        {
          id: Date.now().toString(),
          amount: finalAmount,
          type: 'earn',
          reason: `${reason} (${multiplier}x Streak Bonus)`,
          timestamp: Date.now(),
        },
        ...state.transactions,
      ],
    }));

    return finalAmount;
  },

  submitTask: (taskId, proofUrl) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'pending', proofUrl } : t
      ),
    }));
  },

  approveTask: (taskId) => {
    const { tasks, user, addTokens } = get();
    const task = tasks.find((t) => t.id === taskId);
  
    if (task && user.role === 'admin') {
      const participantCount = task.assignedTo.length;
      
      if (participantCount > 1) {
        // TEAM-UP LOGIC: Split the pot
        const splitReward = Math.floor(task.reward / participantCount);
        task.assignedTo.forEach(userId => {
          // In a real app, you'd call a DB update for each user.
          // For the prototype, we'll just log the split.
          console.log(`Splitting ${splitReward} to user: ${userId}`);
        });
        // Add the split reward to the current user (if they were part of it)
        addTokens(splitReward, `Team-Up Completion: ${task.title}`);
      } else {
        // Solo Reward
        addTokens(task.reward, `Completed: ${task.title}`);
      }
  
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'completed' } : t
        ),
        user: { ...state.user, streak: state.user.streak + 1 }
      }));
    }
  },

  purchaseItem: (itemId) => {
    const { marketItems, user } = get();
    const item = marketItems.find((i) => i.id === itemId);
    if (!item) return false;

    const discount = user.streak >= 7 ? 0.9 : 1.0;
    const finalCost = Math.floor(item.cost * discount);

    if (user.tokens >= finalCost) {
      set((state) => ({
        user: { ...state.user, tokens: state.user.tokens - finalCost },
        transactions: [
          {
            id: Date.now().toString(),
            amount: finalCost,
            type: 'spend',
            reason: `Bought: ${item.name}`,
            timestamp: Date.now(),
          },
          ...state.transactions,
        ],
      }));
      return true;
    }
    return false;
  },

  openMysteryBox: () => {
    const { user, addTokens } = get();
    const cost = 40;

    if (user.tokens < cost) return 'Insufficient Tokens';

    const roll = Math.random() * 100;
    let prize = '';
    if (roll <= 5) prize = '🌟 LEGENDARY: $10 Allowance!';
    else if (roll <= 25) prize = '💎 RARE: No Chores for 1 Day!';
    else prize = '📦 COMMON: 10 Bonus Tokens';

    set((state) => ({
      user: { ...state.user, tokens: state.user.tokens - cost },
      transactions: [
        {
          id: Date.now().toString(),
          amount: cost,
          type: 'spend',
          reason: `Mystery Box: ${prize}`,
          timestamp: Date.now(),
        },
        ...state.transactions,
      ],
    }));

    if (prize.includes('Bonus Tokens')) {
      addTokens(10, 'Mystery Box Win');
    }

    return prize;
  },

  resetStreak: () => {
    set((state) => ({ user: { ...state.user, streak: 0 } }));
    Alert.alert(
      'Streak Reset',
      'Oh no! You missed a day. The multiplier is back to 1.0x.'
    );
  },

  placeBid: (amount) => {
    const { auction, user } = get();

    if (!auction.isActive) {
      Alert.alert('Auction Inactive', 'The auction is not currently active.');
      return;
    }

    if (amount <= auction.highestBid) {
      Alert.alert('Low Bid', 'You must bid higher than the current price!');
      return;
    }

    if (user.tokens < amount) {
      Alert.alert(
        'Insufficient Funds',
        "You don't have enough tokens for this bid!"
      );
      return;
    }

    const newTime = auction.timeLeft < 60 ? 60 : auction.timeLeft;

    set((state) => ({
      auction: {
        ...state.auction,
        highestBid: amount,
        highestBidder: state.user.name,
        timeLeft: newTime,
      },
    }));
  },

  tickAuction: () => {
    const { auction } = get();
    if (!auction.isActive || auction.timeLeft <= 0) return;

    set((state) => ({
      auction: { ...state.auction, timeLeft: state.auction.timeLeft - 1 },
    }));

    if (auction.timeLeft === 1) {
      Alert.alert(
        'AUCTION ENDED!',
        `${auction.highestBidder ?? 'No one'} won the ${auction.itemName}!`
      );
    }
  },

  depositToVault: (amount) => {
    const { user } = get();
    if (amount <= 0) return;

    if (user.tokens >= amount) {
      set((state) => ({
        user: { ...state.user, tokens: state.user.tokens - amount },
        vaultBalance: state.vaultBalance + amount,
        transactions: [
          {
            id: Date.now().toString(),
            amount,
            type: 'spend',
            reason: 'Vault Deposit',
            timestamp: Date.now(),
          },
          ...state.transactions,
        ],
      }));
    }
  },

  withdrawFromVault: (amount) => {
    const { vaultBalance } = get();
    if (amount <= 0 || vaultBalance < amount) return;

    set((state) => ({
      user: { ...state.user, tokens: state.user.tokens + amount },
      vaultBalance: state.vaultBalance - amount,
      transactions: [
        {
          id: Date.now().toString(),
          amount,
          type: 'earn',
          reason: 'Vault Withdrawal',
          timestamp: Date.now(),
        },
        ...state.transactions,
      ],
    }));
  },

  applyInterest: () => {
    const { vaultBalance, interestRate } = get();
    if (vaultBalance <= 0) return;

    const interestEarned = Math.floor(vaultBalance * interestRate);
    if (interestEarned <= 0) return;

    set((state) => ({
      vaultBalance: state.vaultBalance + interestEarned,
      transactions: [
        {
          id: Date.now().toString(),
          amount: interestEarned,
          type: 'earn',
          reason: 'Vault Interest Earned',
          timestamp: Date.now(),
        },
        ...state.transactions,
      ],
    }));
  },

  login: (email, pass) => {
    const { mockUsers } = get();
    const user = mockUsers.find(
      (u) =>
        u.name.toLowerCase().includes(email.toLowerCase()) &&
        u.password === pass
    );

    if (user) {
      set({ user, currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },
}));