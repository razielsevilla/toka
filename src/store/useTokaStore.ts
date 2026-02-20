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
  wishlist: string[]; // <-- Added for children's wishlist
}

interface Task {
  id: string;
  title: string;
  reward: number;
  status: 'open' | 'accepted' | 'pending' | 'completed';
  type: 'regular' | 'spontaneous';
  frequency?: 'daily' | 'weekly' | 'monthly';
  assignedTo: string[]; // empty if spontaneous and not yet accepted
  proofUrl?: string;
  rejectionReason?: string; // <-- Added to support rejectTask logic
}

interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: number;
}

// Added Notification Interface
interface Notification {
  id: string;
  type: 'task' | 'market' | 'rejection' | 'market_purchase';
  message: string;
  read: boolean;
  timestamp?: number;
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
  notifications: Notification[]; // <-- Added notifications state

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

  // --- NEW ACTIONS ---
  addTask: (taskData: Partial<Task>) => void;
  acceptTask: (taskId: string, userId: string) => void;
  setWishlistGoal: (itemId: string) => void;
  addMember: (name: string, role: UserRole) => void;
  rejectTask: (taskId: string, reason: string) => void;
  addMarketItem: (item: { name: string; cost: number; type: string }) => void;
  removeMarketItem: (itemId: string) => void;
  clearNotifications: (type: 'task' | 'market' | 'rejection' | 'market_purchase') => void;
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
    wishlist: [],
  },
  tasks: [
    { id: '1', title: 'Wash the Dishes', reward: 20, status: 'open', type: 'regular', frequency: 'daily', assignedTo: [] },
    { id: '2', title: 'Clean the Backyard', reward: 50, status: 'open', type: 'regular', frequency: 'weekly', assignedTo: [] },
    { id: '3',  title: 'Clean the Garage (Team-Up)', reward: 100, status: 'open', type: 'regular', frequency: 'monthly', assignedTo: ['user_01', 'sibling_01'] },
    { id: '4',  title: 'Wash the Car', reward: 80, status: 'open', type: 'spontaneous', assignedTo: [] },
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
    { id: 'u_parent', name: 'Mom (Admin)', role: 'admin', tokens: 0, streak: 0, householdId: 'house_123', password: '123', wishlist: [] },
    { id: 'u_child', name: 'Raziel (Member)', role: 'member', tokens: 150, streak: 5, householdId: 'house_123', password: '123', wishlist: [] },
  ],
  notifications: [],

  // --- ACTIONS ---

  setRole: (role) => set((state) => ({ user: { ...state.user, role } })),

  generateInviteCode: () => {
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
          console.log(`Splitting ${splitReward} to user: ${userId}`);
        });
        addTokens(splitReward, `Team-Up Completion: ${task.title}`);
      } else {
        addTokens(task.reward, `Completed: ${task.title}`);
      }
  
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'completed', rejectionReason: undefined } : t
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
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'market_purchase',
        message: `${user.name} just claimed: ${item?.name}!`,
        read: false,
        timestamp: Date.now(),
      };

      set((state) => ({
        user: { ...state.user, tokens: state.user.tokens - finalCost },
        notifications: [newNotification, ...state.notifications],
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
      Alert.alert('Insufficient Funds', "You don't have enough tokens for this bid!");
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
      Alert.alert('AUCTION ENDED!', `${auction.highestBidder ?? 'No one'} won the ${auction.itemName}!`);
    }
  },

  // --- VAULT LOGIC UPDATES ---

  depositToVault: (amount: number) => {
    const { currentUser, user } = get();
    
    // Fallback if currentUser isn't active (for quick prototype testing)
    const activeUser = currentUser || user;

    if (!activeUser || amount <= 0 || activeUser.tokens < amount) {
      Alert.alert("Invalid Amount", "You don't have enough spendable tokens!");
      return;
    }

    const updatedUser = { 
      ...activeUser, 
      tokens: activeUser.tokens - amount 
    };

    set((state) => ({
      user: updatedUser, // Sync default user state
      currentUser: updatedUser, // Sync active logged-in user
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
      vaultBalance: state.vaultBalance + amount,
      transactions: [
        { id: Date.now().toString(), amount, type: 'spend', reason: 'Vault Deposit', timestamp: Date.now() },
        ...state.transactions
      ]
    }));
  },

  withdrawFromVault: (amount: number) => {
    const { vaultBalance, currentUser, user } = get();
    
    const activeUser = currentUser || user;

    if (!activeUser || amount <= 0 || vaultBalance < amount) {
      Alert.alert("Invalid Amount", "You don't have enough in the vault!");
      return;
    }

    const updatedUser = { 
      ...activeUser, 
      tokens: activeUser.tokens + amount 
    };

    set((state) => ({
      user: updatedUser, 
      currentUser: updatedUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
      vaultBalance: state.vaultBalance - amount,
      transactions: [
        { id: Date.now().toString(), amount, type: 'earn', reason: 'Vault Withdrawal', timestamp: Date.now() },
        ...state.transactions
      ]
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

  // --- NEW LOGIC IMPLEMENTATIONS ---

  clearNotifications: (type) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.type === type ? { ...n, read: true } : n
      ),
    }));
  },

  addTask: (taskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || 'New Task',
      reward: taskData.reward || 10,
      status: taskData.status || 'open',
      type: taskData.type || 'regular',
      assignedTo: taskData.assignedTo || [],
      ...taskData,
    };
    
    set((state) => {
      const updatedNotifications = newTask.type === 'spontaneous' 
        ? [{ id: Date.now().toString(), type: 'task' as const, message: 'New instant task available!', read: false }, ...state.notifications]
        : state.notifications;

      return {
        tasks: [...state.tasks, newTask],
        notifications: updatedNotifications
      };
    });
  },

  acceptTask: (taskId, userId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId && t.type === 'spontaneous' && t.status === 'open'
          ? { ...t, status: 'accepted', assignedTo: [...t.assignedTo, userId], rejectionReason: undefined }
          : t
      ),
    }));
  },

  setWishlistGoal: (itemId) => {
    set((state) => {
      const isAlreadyInWishlist = state.user.wishlist.includes(itemId);
      return {
        user: {
          ...state.user,
          wishlist: isAlreadyInWishlist ? state.user.wishlist : [...state.user.wishlist, itemId],
        }
      };
    });
  },

  addMember: (name, role) => {
    const { user, mockUsers } = get();

    if (user.role !== 'admin') {
      Alert.alert('Permission Denied', 'Only parents/admins can add new members.');
      return;
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      role,
      tokens: 0,
      streak: 0,
      householdId: user.householdId,
      password: '123', 
      wishlist: [],
    };

    set({ mockUsers: [...mockUsers, newUser] });
    Alert.alert('Success', `${name} has been added as a ${role}!`);
  },

  rejectTask: (taskId, reason) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId 
          ? { ...t, status: 'open', proofUrl: undefined, rejectionReason: reason } 
          : t
      ),
      notifications: [
        { id: Date.now().toString(), type: 'rejection', message: 'A chore was sent back!', read: false },
        ...state.notifications
      ]
    }));
    Alert.alert("Task Sent Back", "The child has been notified to try again.");
  },

  addMarketItem: (item) => {
    const newItem = { ...item, id: `m_${Date.now()}` };
    set((state) => ({
      marketItems: [...state.marketItems, newItem],
      notifications: [
        { id: Date.now().toString(), type: 'market', message: 'New reward in the market!', read: false },
        ...state.notifications
      ]
    }));
    Alert.alert("Market Updated", `${item.name} is now available for the kids!`);
  },

  removeMarketItem: (itemId) => {
    set((state) => ({
      marketItems: state.marketItems.filter((i) => i.id !== itemId)
    }));
  },
}));