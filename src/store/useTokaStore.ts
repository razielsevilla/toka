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

  // Actions
  setRole: (role: UserRole) => void;
  generateInviteCode: () => string;
  joinHousehold: (code: string) => void;
  addTokens: (amount: number, reason: string) => void;
  submitTask: (taskId: string, proofUrl: string) => void;
  approveTask: (taskId: string) => void;
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
    // Gamification Logic: 1.2x Multiplier if streak >= 7
    const multiplier = user.streak >= 7 ? 1.2 : 1.0;
    const finalAmount = Math.floor(amount * multiplier);

    set((state) => ({
      user: { ...state.user, tokens: state.user.tokens + finalAmount },
      transactions: [
        { id: Date.now().toString(), amount: finalAmount, type: 'earn', reason, timestamp: Date.now() },
        ...state.transactions,
      ],
    }));
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
}));