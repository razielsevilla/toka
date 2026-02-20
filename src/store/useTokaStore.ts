import { Alert } from 'react-native';
import { create } from 'zustand';
import { User, Task, Transaction, Notification, TokaState, UserRole } from '../types';

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
    set((state) => {
      const activeUser = state.currentUser || state.user;
      const updatedUser = { ...activeUser, householdId: `house_${code}` };
      console.log(`Joined household: house_${code}`);
      return {
        user: updatedUser,
        currentUser: updatedUser,
        mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u)
      };
    });
  },

  addTokens: (amount, reason) => {
    const { currentUser, user } = get();
    const activeUser = currentUser || user;

    let multiplier = 1.0;
    if (activeUser.streak >= 7) multiplier = 1.2;
    if (activeUser.streak >= 14) multiplier = 1.5;
    if (activeUser.streak >= 30) multiplier = 2.0;

    const finalAmount = Math.floor(amount * multiplier);
    const updatedUser = { ...activeUser, tokens: activeUser.tokens + finalAmount };

    set((state) => ({
      user: updatedUser,
      currentUser: updatedUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
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
    const { tasks, user, mockUsers } = get();
    const task = tasks.find((t) => t.id === taskId);
  
    // --- WITHDRAWAL APPROVAL LOGIC ---
    if (task && task.isWithdrawal && user.role === 'admin') {
      const childId = task.assignedTo[0];
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId), // Remove request
        mockUsers: state.mockUsers.map(u => 
          u.id === childId ? { ...u, tokens: u.tokens + task.reward } : u
        )
      }));
      return;
    }

    // --- STANDARD CHORE APPROVAL LOGIC ---
    if (task && user.role === 'admin') {
      const participantCount = task.assignedTo.length;
      let updatedMockUsers = [...mockUsers];
      
      if (participantCount > 0) {
        const splitReward = Math.floor(task.reward / participantCount);
        
        // Target the assigned children and update their balances directly
        updatedMockUsers = updatedMockUsers.map(u => {
          if (task.assignedTo.includes(u.id)) {
            return { ...u, tokens: u.tokens + splitReward, streak: u.streak + 1 };
          }
          return u;
        });
      }
  
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'completed', rejectionReason: undefined } : t
        ),
        mockUsers: updatedMockUsers // Save the updated child balances
      }));
    }
  },

  purchaseItem: (itemId) => {
    const { marketItems, currentUser, user, mockUsers } = get();
    
    // Grab the active logged-in child
    const activeUser = currentUser || user; 
    
    const item = marketItems.find((i) => i.id === itemId);
    if (!item) return false;

    // Apply streak discount if applicable
    const discount = activeUser.streak >= 7 ? 0.9 : 1.0;
    const finalCost = Math.floor(item.cost * discount);

    if (activeUser.tokens >= finalCost) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'market_purchase',
        message: `${activeUser.name.split(' ')[0]} just claimed: ${item.name}!`,
        read: false,
        timestamp: Date.now(),
      };

      // Create the updated user object with deducted tokens
      const updatedUser = {
        ...activeUser,
        tokens: activeUser.tokens - finalCost
      };

      set((state) => ({
        user: updatedUser, 
        currentUser: updatedUser, 
        mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u), 
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
      
      Alert.alert("Reward Claimed! 🎉", `You successfully exchanged ${finalCost} tokens for ${item.name}.`);
      return true;
    }
    
    Alert.alert("Insufficient Tokens", `You need ${finalCost} tokens for this reward. Keep doing those chores!`);
    return false;
  },

  openMysteryBox: () => {
    const { currentUser, user, addTokens } = get();
    const activeUser = currentUser || user;
    const cost = 40;

    if (activeUser.tokens < cost) return 'Insufficient Tokens';

    const roll = Math.random() * 100;
    let prize = '';
    if (roll <= 5) prize = '🌟 LEGENDARY: $10 Allowance!';
    else if (roll <= 25) prize = '💎 RARE: No Chores for 1 Day!';
    else prize = '📦 COMMON: 10 Bonus Tokens';

    const updatedUser = { ...activeUser, tokens: activeUser.tokens - cost };

    set((state) => ({
      user: updatedUser,
      currentUser: updatedUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
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
    const { currentUser, user } = get();
    const activeUser = currentUser || user;
    const updatedUser = { ...activeUser, streak: 0 };

    set((state) => ({ 
      user: updatedUser,
      currentUser: updatedUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u)
    }));

    Alert.alert('Streak Reset', 'Oh no! You missed a day. The multiplier is back to 1.0x.');
  },

  placeBid: (amount) => {
    const { auction, currentUser, user } = get();
    const activeUser = currentUser || user;

    if (!auction.isActive) {
      Alert.alert('Auction Inactive', 'The auction is not currently active.');
      return;
    }

    if (amount <= auction.highestBid) {
      Alert.alert('Low Bid', 'You must bid higher than the current price!');
      return;
    }

    if (activeUser.tokens < amount) {
      Alert.alert('Insufficient Funds', "You don't have enough tokens for this bid!");
      return;
    }

    const newTime = auction.timeLeft < 60 ? 60 : auction.timeLeft;

    set((state) => ({
      auction: {
        ...state.auction,
        highestBid: amount,
        highestBidder: activeUser.name,
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
      user: updatedUser, 
      currentUser: updatedUser, 
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

    // Create a pseudo-task for the parent to see
    const withdrawalRequest: Task = {
      id: `wd_${Date.now()}`,
      title: `Withdrawal Request: ${amount} Tokens`,
      reward: amount,
      status: 'pending',
      type: 'spontaneous',
      assignedTo: [activeUser.id],
      isWithdrawal: true,
    };

    set((state) => ({
      tasks: [...state.tasks, withdrawalRequest],
      vaultBalance: state.vaultBalance - amount, 
    }));

    Alert.alert("Request Sent", "Waiting for parent approval to release tokens.");
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
    const { currentUser, user } = get();
    const activeUser = currentUser || user;
    
    const isAlreadyInWishlist = activeUser.wishlist.includes(itemId);
    const newWishlist = isAlreadyInWishlist ? activeUser.wishlist : [...activeUser.wishlist, itemId];
    
    const updatedUser = { ...activeUser, wishlist: newWishlist };

    set((state) => ({
      user: updatedUser,
      currentUser: updatedUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u)
    }));
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
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    // 1. Handle Withdrawal Denials (Refund Vault)
    if (task.isWithdrawal) {
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId), 
        vaultBalance: state.vaultBalance + task.reward, 
        notifications: [
          { id: Date.now().toString(), type: 'rejection', message: 'Withdrawal request declined.', read: false },
          ...state.notifications
        ]
      }));
      Alert.alert("Declined", "The tokens have been safely returned to the vault.");
      return;
    }

    // 2. Handle Chore Rejections
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId 
          ? { 
              ...t, 
              status: t.type === 'spontaneous' ? 'accepted' : 'open', 
              proofUrl: undefined, 
              rejectionReason: reason 
            } 
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