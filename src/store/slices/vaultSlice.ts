import { Alert } from 'react-native';
import { StateCreator } from 'zustand';
import { Task, Transaction, TokaState } from '../../types';

export const createVaultSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'vaultBalance' | 'interestRate' | 'interestFrequency' | 'lastInterestApplied'
    | 'conversionRate' | 'monthlyBudget' | 'bills'
    | 'depositToVault' | 'withdrawFromVault' | 'requestAllowanceCashout'
    | 'applyInterest' | 'setInterestPolicy' | 'setBudgetPolicy'
    | 'addBill' | 'removeBill' | 'processBills'
    | 'transferTokens' | 'resetStreak'
>> = (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    vaultBalance: 0,
    interestRate: 0.05,
    interestFrequency: 'weekly' as const,
    lastInterestApplied: Date.now(),
    conversionRate: 0.50,
    monthlyBudget: 500.00,
    bills: [
        { id: 'b1', title: 'WiFi Tax 📶', amount: 10, frequency: 'weekly' as const },
    ],

    // ── Actions ────────────────────────────────────────────────────────────────

    resetStreak: () => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        const updatedUser = { ...activeUser, streak: 0 };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
        }));
        Alert.alert('Streak Reset', 'Oh no! You missed a day. The multiplier is back to 1.0x.');
    },

    depositToVault: (amount) => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        if (!activeUser || amount <= 0 || activeUser.tokens < amount) {
            Alert.alert('Invalid Amount', "You don't have enough spendable tokens!");
            return;
        }
        const updatedUser = { ...activeUser, tokens: activeUser.tokens - amount };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            vaultBalance: state.vaultBalance + amount,
            transactions: [{ id: `dep_${Date.now()}`, amount, type: 'spend', reason: 'Vault Deposit', timestamp: Date.now() }, ...state.transactions],
            notifications: [{ id: `notif_${Date.now()}`, type: 'transfer' as const, message: `${activeUser.name.split(' ')[0]} deposited ${amount} 💎 into the family vault!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
    },

    withdrawFromVault: (amount) => {
        const { vaultBalance, currentUser, user } = get();
        const activeUser = currentUser || user;
        if (!activeUser || amount <= 0 || vaultBalance < amount) {
            Alert.alert('Invalid Amount', "You don't have enough in the vault!");
            return;
        }
        const withdrawalRequest: Task = { id: `wd_${Date.now()}`, title: `Withdrawal Request: ${amount} Tokens`, reward: amount, status: 'pending', type: 'spontaneous', assignedTo: [activeUser.id], isWithdrawal: true };
        set((state) => ({
            tasks: [...state.tasks, withdrawalRequest],
            vaultBalance: state.vaultBalance - amount,
            notifications: [{ id: `notif_${Date.now()}`, type: 'task' as const, message: `${activeUser.name.split(' ')[0]} wants to withdraw ${amount} 💎 from the vault!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
        Alert.alert('Request Sent', 'Waiting for parent approval to release tokens.');
    },

    requestAllowanceCashout: (amount) => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        if (!activeUser || amount <= 0 || activeUser.tokens < amount) {
            Alert.alert('Invalid Amount', "You don't have enough spendable tokens!");
            return;
        }
        const cashoutRequest: Task = { id: `allowance_${Date.now()}`, title: `Allowance Cash Out: ₱${(amount * 0.5).toFixed(2)} (${amount} Tokens)`, reward: amount, status: 'pending', type: 'spontaneous', assignedTo: [activeUser.id], isAllowanceCashout: true };
        set((state) => ({
            tasks: [...state.tasks, cashoutRequest],
            notifications: [{ id: `notif_${Date.now()}`, type: 'task' as const, message: `${activeUser.name.split(' ')[0]} wants to cash out ${amount} 💎 (₱${(amount * 0.5).toFixed(2)})!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
        Alert.alert('Request Sent', 'Waiting for parent approval to cash out tokens.');
    },

    applyInterest: () => {
        const { vaultBalance, interestRate } = get();
        if (vaultBalance <= 0) return;
        const earned = Math.floor(vaultBalance * interestRate);
        if (earned > 0) {
            set((state) => ({
                vaultBalance: state.vaultBalance + earned,
                transactions: [{ id: `int_${Date.now()}`, amount: earned, type: 'earn', reason: `Vault Interest (${(interestRate * 100).toFixed(0)}% APY) 📈`, timestamp: Date.now() }, ...state.transactions],
            }));
            Alert.alert('Interest Paid! 💰', `Your savings grew by ${earned} 💎!`);
        }
    },

    setInterestPolicy: (rate, frequency) => set({ interestRate: rate, interestFrequency: frequency }),

    setBudgetPolicy: (rate, budget) => set({ conversionRate: rate, monthlyBudget: budget }),

    addBill: (bill) => {
        set((state) => ({ bills: [...state.bills, { ...bill, id: `bill_${Date.now()}` }] }));
        Alert.alert('Bill Added', `${bill.title} will now be deducted ${bill.frequency}.`);
    },

    removeBill: (billId) => set((state) => ({ bills: state.bills.filter(b => b.id !== billId) })),

    processBills: () => {
        const { bills, mockUsers, user, currentUser } = get();
        if (bills.length === 0) return;
        const totalDeductions = bills.reduce((s, b) => s + b.amount, 0);
        const billBreakdown = bills.map(b => b.title).join(', ');
        const activeUser = currentUser || user;
        const updatedMockUsers = mockUsers.map(u => u.role === 'member' ? { ...u, tokens: Math.max(0, u.tokens - totalDeductions) } : u);
        let updatedActiveUser = activeUser;
        let newTransactions: Transaction[] = [];
        if (activeUser.role === 'member') {
            const deducted = Math.min(activeUser.tokens, totalDeductions);
            updatedActiveUser = { ...activeUser, tokens: activeUser.tokens - deducted };
            newTransactions = bills.map(b => ({ id: `tx_bill_${Date.now()}_${b.id}`, amount: b.amount, type: 'spend' as const, reason: `Bill Paid: ${b.title}`, timestamp: Date.now() }));
        }
        set((state) => ({
            mockUsers: updatedMockUsers,
            user: activeUser.id === updatedActiveUser.id ? updatedActiveUser : state.user,
            currentUser: currentUser?.id === updatedActiveUser.id ? updatedActiveUser : state.currentUser,
            transactions: [...newTransactions, ...state.transactions],
            notifications: [{ id: `notif_${Date.now()}`, type: 'market' as const, message: `Bills processed: ${billBreakdown}`, read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
        }));
        Alert.alert('Bills Processed 🧾', `Deducted ${totalDeductions} tokens from members for: ${billBreakdown}`);
    },

    transferTokens: (toUserId, amount, memo) => {
        const { currentUser, user, mockUsers } = get();
        const activeUser = currentUser || user;
        if (amount <= 0 || activeUser.tokens < amount) { Alert.alert('Transfer Failed', 'Invalid amount or insufficient tokens.'); return; }
        const receiver = mockUsers.find(u => u.id === toUserId);
        if (!receiver) { Alert.alert('Transfer Failed', 'Could not find the recipient.'); return; }
        const updatedSender = { ...activeUser, tokens: activeUser.tokens - amount };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedSender : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedSender : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedSender : u.id === toUserId ? { ...u, tokens: u.tokens + amount } : u),
            transactions: [{ id: `tx_${Date.now()}`, amount, type: 'spend', reason: `Transfer to ${receiver.name}: ${memo}`, timestamp: Date.now() }, ...state.transactions],
            notifications: [{ id: `notif_${Date.now()}`, type: 'transfer' as const, message: `${activeUser.name.split(' ')[0]} sent ${amount} 💎 to ${receiver.name.split(' ')[0]}!`, read: false, timestamp: Date.now(), targetRole: 'all' as const }, ...state.notifications],
        }));
        Alert.alert('Transfer Complete! 💸', `Successfully sent ${amount} 💎 to ${receiver.name}.`);
    },
});
