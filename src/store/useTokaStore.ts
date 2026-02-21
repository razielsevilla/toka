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
    xp: 0,
    level: 1,
    badges: ['Seedling'],
    unlockedAchievements: [],
  },
  tasks: [
    { id: '1', title: 'Wash the Dishes', reward: 20, status: 'open', type: 'regular', frequency: 'daily', assignedTo: [] },
    { id: '2', title: 'Clean the Backyard', reward: 50, status: 'open', type: 'regular', frequency: 'weekly', assignedTo: [] },
    { id: '3', title: 'Clean the Garage (Team-Up)', reward: 100, status: 'open', type: 'regular', frequency: 'monthly', assignedTo: ['user_01', 'sibling_01'] },
    { id: '4', title: 'Wash the Car', reward: 80, status: 'open', type: 'spontaneous', assignedTo: [], deadline: Date.now() + 3600000 },
  ],
  transactions: [],
  marketItems: [
    { id: 'm1', name: '30 Mins Screen Time', cost: 50, type: 'voucher' },
    { id: 'm2', name: 'Pizza Night', cost: 200, type: 'real-world' },
    { id: 'm3', name: 'Cool Avatar Hat', cost: 15, originalCost: 30, saleUntil: Date.now() + 86400000, type: 'in-app' },
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
  interestFrequency: 'weekly',
  lastInterestApplied: Date.now(),
  conversionRate: 0.01, // 1 token = $0.01
  currentUser: null,
  mockUsers: [
    { id: 'u_parent', name: 'Mom (Admin)', role: 'admin', tokens: 0, streak: 0, householdId: 'house_123', password: '123', wishlist: [], unlockedAchievements: [] },
    { id: 'u_child', name: 'Raziel (Member)', role: 'member', tokens: 150, streak: 5, householdId: 'house_123', password: '123', wishlist: [], xp: 450, level: 1, badges: ['Seedling', 'First Chore!'], unlockedAchievements: [] },
  ],
  monthlyBudget: 50.00, // Real-world dollars max allowed
  notifications: [],
  bills: [
    { id: 'b1', title: 'WiFi Tax 📶', amount: 10, frequency: 'weekly' }
  ],

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

    // XP Calculation
    const xpGained = finalAmount * 10;
    const newXp = (activeUser.xp || 0) + xpGained;
    const newLevel = Math.floor(newXp / 500) + 1;
    let newBadges = activeUser.badges || ['Seedling'];

    // Auto-award badges at milestones
    if (newLevel >= 2 && !newBadges.includes('Rising Star')) newBadges = [...newBadges, 'Rising Star'];
    if (newLevel >= 5 && !newBadges.includes('Chore Master')) newBadges = [...newBadges, 'Chore Master'];

    const updatedUser = {
      ...activeUser,
      tokens: activeUser.tokens + finalAmount,
      xp: newXp,
      level: newLevel,
      badges: newBadges
    };

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
            const xpGained = splitReward * 10;
            const newXp = (u.xp || 0) + xpGained;
            const newLevel = Math.floor(newXp / 500) + 1;
            let newBadges = u.badges || ['Seedling'];

            if (newLevel >= 2 && !newBadges.includes('Rising Star')) newBadges = [...newBadges, 'Rising Star'];
            if (newLevel >= 5 && !newBadges.includes('Chore Master')) newBadges = [...newBadges, 'Chore Master'];

            return {
              ...u,
              tokens: u.tokens + splitReward,
              streak: u.streak + 1,
              xp: newXp,
              level: newLevel,
              badges: newBadges
            };
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
    const { marketItems, currentUser, user } = get();

    // Grab the active logged-in child
    const activeUser = currentUser || user;

    const item = marketItems.find((i) => i.id === itemId);
    if (!item) return false;

    // Apply streak discount if applicable
    const discount = activeUser.streak >= 7 ? 0.9 : 1.0;
    const finalCost = Math.floor(item.cost * discount);

    const isGoal = activeUser.activeGoal?.itemId === itemId;
    const goalSavedTokens = isGoal && activeUser.activeGoal ? activeUser.activeGoal.savedTokens : 0;

    if ((activeUser.tokens + goalSavedTokens) >= finalCost) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'market_purchase',
        message: `${activeUser.name.split(' ')[0]} just claimed: ${item.name}!`,
        read: false,
        timestamp: Date.now(),
      };

      let newTokensCount = activeUser.tokens;
      let newGoal = activeUser.activeGoal;

      // Handle payment routing based on whether they used goal tokens or regular tokens
      if (isGoal) {
        if (goalSavedTokens >= finalCost) {
          // Paid purely out of goal savings, pocket the difference if any (though we clear the goal)
          newTokensCount = newTokensCount + (goalSavedTokens - finalCost);
        } else {
          // Goal didn't cover it all, dip into regular tokens
          const remainderToPay = finalCost - goalSavedTokens;
          newTokensCount -= remainderToPay;
        }
        // Clear goal upon purchase
        newGoal = undefined;
      } else {
        newTokensCount -= finalCost;
      }

      // Create the updated user object with deducted tokens
      const updatedUser = {
        ...activeUser,
        tokens: newTokensCount,
        activeGoal: newGoal
      };

      set((state) => ({
        user: state.user.id === activeUser.id ? updatedUser : state.user,
        currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
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

      Alert.alert("Reward Claimed! 🎉", `You successfully exchanged ${finalCost} 💎 for ${item.name}.`);
      return true;
    }

    Alert.alert("Insufficient Tokens", `You need ${finalCost} 💎 for this reward. Keep doing those chores!`);
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
    const { vaultBalance, interestRate, currentUser, user } = get();
    if (vaultBalance <= 0) return;

    // Calculate interest (e.g., 5% of vault balance)
    const interestEarned = Math.floor(vaultBalance * interestRate);

    if (interestEarned > 0) {
      const activeUser = currentUser || user;

      set((state) => ({
        vaultBalance: state.vaultBalance + interestEarned,
        transactions: [
          {
            id: `int_${Date.now()}`,
            amount: interestEarned,
            type: 'earn',
            reason: `Vault Interest (${(interestRate * 100).toFixed(0)}% APY) 📈`,
            timestamp: Date.now(),
          },
          ...state.transactions,
        ],
      }));

      Alert.alert(
        "Interest Paid! 💰",
        `Your savings grew by ${interestEarned} 💎 just by sitting in the vault!`
      );
    }
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

    if (activeUser.activeGoal?.itemId === itemId) return; // Already the goal

    // Return any previously saved tokens to their main wallet if they abandon their previous goal
    const refundedTokens = activeUser.activeGoal ? activeUser.activeGoal.savedTokens : 0;

    const isAlreadyInWishlist = activeUser.wishlist.includes(itemId);
    const newWishlist = isAlreadyInWishlist ? activeUser.wishlist : [...activeUser.wishlist, itemId];

    const updatedUser = {
      ...activeUser,
      wishlist: newWishlist,
      tokens: activeUser.tokens + refundedTokens,
      activeGoal: { itemId, savedTokens: 0 }
    };

    set((state) => ({
      user: state.user.id === activeUser.id ? updatedUser : state.user,
      currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
      ...(refundedTokens > 0 ? {
        transactions: [
          { id: `refund_${Date.now()}`, amount: refundedTokens, type: 'earn', reason: 'Goal Refunded', timestamp: Date.now() },
          ...state.transactions
        ]
      } : {})
    }));
  },

  fundGoal: (amount) => {
    const { currentUser, user } = get();
    const activeUser = currentUser || user;

    if (!activeUser.activeGoal || amount <= 0 || activeUser.tokens < amount) {
      Alert.alert("Invalid Amount", "You don't have enough tokens!");
      return;
    }

    const updatedUser = {
      ...activeUser,
      tokens: activeUser.tokens - amount,
      activeGoal: {
        ...activeUser.activeGoal,
        savedTokens: activeUser.activeGoal.savedTokens + amount
      }
    };

    set((state) => ({
      user: state.user.id === activeUser.id ? updatedUser : state.user,
      currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
      mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
      transactions: [
        { id: `goal_${Date.now()}`, amount, type: 'spend', reason: 'Deposited to Goal', timestamp: Date.now() },
        ...state.transactions
      ]
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

  setInterestPolicy: (rate, frequency) => {
    set({ interestRate: rate, interestFrequency: frequency });
  },

  setBudgetPolicy: (rate, budget) => {
    set({ conversionRate: rate, monthlyBudget: budget });
  },

  addBill: (bill) => {
    set((state) => ({
      bills: [...state.bills, { ...bill, id: `bill_${Date.now()}` }]
    }));
    Alert.alert("Bill Added", `${bill.title} will now be deducted ${bill.frequency}.`);
  },

  removeBill: (billId) => {
    set((state) => ({
      bills: state.bills.filter(b => b.id !== billId)
    }));
  },

  processBills: () => {
    const { bills, mockUsers, user, currentUser } = get();
    if (bills.length === 0) return;

    let totalDeductions = 0;
    const billBreakdown = bills.map(b => {
      totalDeductions += b.amount;
      return b.title;
    }).join(", ");

    const activeUser = currentUser || user;

    // Process for all members
    const updatedMockUsers = mockUsers.map(u => {
      if (u.role === 'member') {
        return { ...u, tokens: Math.max(0, u.tokens - totalDeductions) };
      }
      return u;
    });

    // Update active user if they are a member
    let updatedActiveUser = activeUser;
    let newTransactions: Transaction[] = [];

    if (activeUser.role === 'member') {
      const amountDeducted = Math.min(activeUser.tokens, totalDeductions); // don't go below 0
      updatedActiveUser = { ...activeUser, tokens: activeUser.tokens - amountDeducted };

      newTransactions = bills.map(b => ({
        id: `tx_${Date.now()}_${b.id}`,
        amount: Math.min(updatedActiveUser.tokens + amountDeducted, b.amount), // Approximate the exact bill deduction if they don't have enough
        type: 'spend' as const,
        reason: `Bill Paid: ${b.title}`,
        timestamp: Date.now()
      }));
    }

    set((state) => ({
      mockUsers: updatedMockUsers,
      user: activeUser.id === updatedActiveUser.id ? updatedActiveUser! : state.user,
      currentUser: currentUser?.id === updatedActiveUser.id ? updatedActiveUser! : state.currentUser,
      transactions: [...newTransactions, ...state.transactions],
      notifications: [
        { id: `notif_${Date.now()}`, type: 'market' as const, message: `Bills processed: ${billBreakdown}`, read: false },
        ...state.notifications
      ]
    }));

    Alert.alert("Bills Processed 🧾", `Deducted a total of ${totalDeductions} tokens from members for: ${billBreakdown}`);
  },

  submitCounterOffer: (taskId, userId, amount, reason) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        status: 'negotiating',
        proposedBy: userId,
        counterOfferAmount: amount,
        counterOfferReason: reason
      } : t),
      notifications: [
        { id: `notif_${Date.now()}`, type: 'task' as const, message: `Someone is negotiating a chore!`, read: false },
        ...state.notifications
      ]
    }));
    Alert.alert("Offer Sent", "Your counter-offer has been sent to the parents for review.");
  },

  acceptCounterOffer: (taskId) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.proposedBy) return;

    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        status: 'accepted',
        assignedTo: [task.proposedBy!],
        reward: task.counterOfferAmount || task.reward,
        counterOfferAmount: undefined,
        counterOfferReason: undefined,
        proposedBy: undefined
      } : t),
    }));
    Alert.alert("Offer Accepted", "The chore has been assigned to the child at the new rate!");
  },

  rejectCounterOffer: (taskId, reason) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        status: 'open',
        counterOfferAmount: undefined,
        counterOfferReason: undefined,
        proposedBy: undefined
      } : t),
      notifications: [
        { id: `notif_${Date.now()}`, type: 'rejection' as const, message: `Your counter-offer was declined: ${reason}`, read: false },
        ...state.notifications
      ]
    }));
    Alert.alert("Offer Declined", "The chore is back on the open market.");
  },

  transferTokens: (toUserId, amount, memo) => {
    const { currentUser, user, mockUsers } = get();
    const activeUser = currentUser || user;

    if (amount <= 0 || activeUser.tokens < amount) {
      Alert.alert("Transfer Failed", "Invalid amount or insufficient tokens.");
      return;
    }

    const receiver = mockUsers.find(u => u.id === toUserId);
    if (!receiver) {
      Alert.alert("Transfer Failed", "Could not find the recipient.");
      return;
    }

    const updatedActiveUser = { ...activeUser, tokens: activeUser.tokens - amount };
    const updatedMockUsers = mockUsers.map(u => {
      if (u.id === activeUser.id) return updatedActiveUser;
      if (u.id === toUserId) return { ...u, tokens: u.tokens + amount };
      return u;
    });

    set((state) => ({
      user: state.user.id === activeUser.id ? updatedActiveUser : state.user,
      currentUser: state.currentUser?.id === activeUser.id ? updatedActiveUser : state.currentUser,
      mockUsers: updatedMockUsers,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          amount,
          type: 'spend',
          reason: `Transfer to ${receiver.name}: ${memo}`,
          timestamp: Date.now()
        },
        ...state.transactions
      ],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          type: 'market',
          message: `${activeUser.name.split(' ')[0]} sent ${amount} 💎 to ${receiver.name.split(' ')[0]}!`,
          read: false
        },
        ...state.notifications
      ]
    }));

    Alert.alert("Transfer Complete! 💸", `Successfully sent ${amount} 💎 to ${receiver.name}.`);
  },

  playDoubleOrNothing: (wager) => {
    const { currentUser, user, mockUsers } = get();
    const activeUser = currentUser || user;

    if (activeUser.tokens < wager || wager <= 0) {
      return 'lose'; // Handled in UI
    }

    const isWin = Math.random() >= 0.5;

    let tokenChange = 0;
    let reason = '';
    let transactionType: 'earn' | 'spend' = 'spend'; // default

    if (isWin) {
      tokenChange = wager; // we gain the wager amount
      reason = `Mini-game Win: Doubled!`;
      transactionType = 'earn';
    } else {
      tokenChange = -wager; // we lose the wager
      reason = `Mini-game Loss`;
      transactionType = 'spend';
    }

    const updatedActiveUser = { ...activeUser, tokens: activeUser.tokens + tokenChange };
    const updatedMockUsers = mockUsers.map(u => u.id === activeUser.id ? updatedActiveUser : u);

    set((state) => ({
      user: state.user.id === activeUser.id ? updatedActiveUser : state.user,
      currentUser: state.currentUser?.id === activeUser.id ? updatedActiveUser : state.currentUser,
      mockUsers: updatedMockUsers,
      transactions: [
        {
          id: `tx_minigame_${Date.now()}`,
          amount: Math.abs(tokenChange),
          type: transactionType,
          reason,
          timestamp: Date.now()
        },
        ...state.transactions
      ]
    }));

    return isWin ? 'win' : 'lose';
  },

  claimAchievement: (achievementId, rewardTokens, badgeName) => {
    const { currentUser, user, mockUsers } = get();
    const activeUser = currentUser || user;

    const alreadyUnlocked = activeUser.unlockedAchievements?.includes(achievementId);
    if (alreadyUnlocked) return;

    const newUnlocked = [...(activeUser.unlockedAchievements || []), achievementId];
    const newBadges = badgeName && !activeUser.badges?.includes(badgeName)
      ? [...(activeUser.badges || []), badgeName]
      : activeUser.badges;

    const updatedActiveUser = {
      ...activeUser,
      tokens: activeUser.tokens + rewardTokens,
      unlockedAchievements: newUnlocked,
      badges: newBadges
    };

    const updatedMockUsers = mockUsers.map(u => u.id === activeUser.id ? updatedActiveUser : u);

    set((state) => ({
      user: state.user.id === activeUser.id ? updatedActiveUser : state.user,
      currentUser: state.currentUser?.id === activeUser.id ? updatedActiveUser : state.currentUser,
      mockUsers: updatedMockUsers,
      transactions: [
        {
          id: `tx_achievement_${Date.now()}`,
          amount: rewardTokens,
          type: 'earn',
          reason: `Achievement Unlocked! 🏆`,
          timestamp: Date.now()
        },
        ...state.transactions
      ]
    }));

    Alert.alert(
      "Achievement Unlocked! 🏅",
      `You earned ${rewardTokens} 💎${badgeName ? ` and the '${badgeName}' badge!` : '!'}`
    );
  }

}));