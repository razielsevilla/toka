import { Alert } from 'react-native';
import { StateCreator } from 'zustand';
import { Task, Notification, TokaState } from '../../types';

export const createTaskSlice: StateCreator<TokaState, [], [], Pick<TokaState,
    | 'tasks'
    | 'addTask' | 'acceptTask' | 'submitTask' | 'approveTask' | 'rejectTask'
    | 'submitCounterOffer' | 'acceptCounterOffer' | 'rejectCounterOffer'
    | 'addTokens'
>> = (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────────
    tasks: [
        { id: '1', title: 'Wash the Dishes', reward: 20, status: 'open', type: 'regular', frequency: 'daily', assignedTo: [] },
        { id: '2', title: 'Clean the Backyard', reward: 50, status: 'open', type: 'regular', frequency: 'weekly', assignedTo: [] },
        { id: '3', title: 'Clean the Garage (Team-Up)', reward: 100, status: 'open', type: 'regular', frequency: 'monthly', assignedTo: ['user_01', 'sibling_01'] },
        { id: '4', title: 'Wash the Car', reward: 80, status: 'open', type: 'spontaneous', assignedTo: [], deadline: Date.now() + 3600000 },
    ],

    // ── Actions ────────────────────────────────────────────────────────────────

    addTokens: (amount, reason) => {
        const { currentUser, user } = get();
        const activeUser = currentUser || user;
        let multiplier = 1.0;
        if (activeUser.streak >= 7) multiplier = 1.2;
        if (activeUser.streak >= 14) multiplier = 1.5;
        if (activeUser.streak >= 30) multiplier = 2.0;
        const finalAmount = Math.floor(amount * multiplier);
        const xpGained = finalAmount * 10;
        const newXp = (activeUser.xp || 0) + xpGained;
        const newLevel = Math.floor(newXp / 500) + 1;
        let newBadges = activeUser.badges || ['Seedling'];
        if (newLevel >= 2 && !newBadges.includes('Rising Star')) newBadges = [...newBadges, 'Rising Star'];
        if (newLevel >= 5 && !newBadges.includes('Chore Master')) newBadges = [...newBadges, 'Chore Master'];
        const updatedUser = { ...activeUser, tokens: activeUser.tokens + finalAmount, xp: newXp, level: newLevel, badges: newBadges };
        set((state) => ({
            user: state.user.id === activeUser.id ? updatedUser : state.user,
            currentUser: state.currentUser?.id === activeUser.id ? updatedUser : state.currentUser,
            mockUsers: state.mockUsers.map(u => u.id === activeUser.id ? updatedUser : u),
            transactions: [
                { id: Date.now().toString(), amount: finalAmount, type: 'earn', reason: `${reason} (${multiplier}x Streak Bonus)`, timestamp: Date.now() },
                ...state.transactions,
            ],
        }));
        return finalAmount;
    },

    submitTask: (taskId, proofUrl) => {
        set((state) => {
            const task = state.tasks.find(t => t.id === taskId);
            return {
                tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'pending', proofUrl } : t),
                notifications: [
                    { id: `notif_${Date.now()}`, type: 'approval' as const, message: `${task?.title || 'A chore'} is ready for review!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const },
                    ...state.notifications,
                ],
            };
        });
    },

    approveTask: (taskId) => {
        const { tasks, user, mockUsers } = get();
        const task = tasks.find(t => t.id === taskId);

        // Allowance cashout approval
        if (task?.isAllowanceCashout && user.role === 'admin') {
            const childId = task.assignedTo[0];
            const childUser = mockUsers.find(u => u.id === childId);
            if (!childUser || childUser.tokens < task.reward) {
                Alert.alert('Error', 'Child no longer has enough tokens. Request cancelled.');
                set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId) }));
                return;
            }
            set((state) => ({
                tasks: state.tasks.filter(t => t.id !== taskId),
                mockUsers: state.mockUsers.map(u => u.id === childId ? { ...u, tokens: u.tokens - task.reward } : u),
                notifications: [
                    { id: `notif_${Date.now()}`, type: 'approval' as const, message: `Your cash out of ${task.reward} 💎 (₱${(task.reward * 0.5).toFixed(2)}) was approved!`, read: false, timestamp: Date.now(), targetRole: 'member' as const },
                    ...state.notifications,
                ],
            }));
            return;
        }

        // Withdrawal approval
        if (task?.isWithdrawal && user.role === 'admin') {
            const childId = task.assignedTo[0];
            set((state) => ({
                tasks: state.tasks.filter(t => t.id !== taskId),
                mockUsers: state.mockUsers.map(u => u.id === childId ? { ...u, tokens: u.tokens + task.reward } : u),
                notifications: [
                    { id: `notif_${Date.now()}`, type: 'approval' as const, message: `Withdrawal of ${task.reward} 💎 from the vault was approved!`, read: false, timestamp: Date.now(), targetRole: 'member' as const },
                    ...state.notifications,
                ],
            }));
            return;
        }

        // Standard chore approval
        if (task && user.role === 'admin') {
            const participantCount = task.assignedTo.length;
            let updatedMockUsers = [...mockUsers];
            if (participantCount > 0) {
                const splitReward = Math.floor(task.reward / participantCount);
                updatedMockUsers = updatedMockUsers.map(u => {
                    if (!task.assignedTo.includes(u.id)) return u;
                    const xpGained = splitReward * 10;
                    const newXp = (u.xp || 0) + xpGained;
                    const newLevel = Math.floor(newXp / 500) + 1;
                    let newBadges = u.badges || ['Seedling'];
                    if (newLevel >= 2 && !newBadges.includes('Rising Star')) newBadges = [...newBadges, 'Rising Star'];
                    if (newLevel >= 5 && !newBadges.includes('Chore Master')) newBadges = [...newBadges, 'Chore Master'];
                    return { ...u, tokens: u.tokens + splitReward, streak: u.streak + 1, xp: newXp, level: newLevel, badges: newBadges };
                });
            }
            set((state) => ({
                tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'completed', rejectionReason: undefined } : t),
                mockUsers: updatedMockUsers,
                notifications: [
                    { id: `notif_${Date.now()}`, type: 'approval' as const, message: `Chore approved: ${task.title}!`, read: false, timestamp: Date.now(), targetRole: 'member' as const },
                    ...state.notifications,
                ],
            }));
        }
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
            const notifs: Notification[] = [];
            if (newTask.type === 'spontaneous') {
                notifs.push({ id: `notif_${Date.now()}`, type: 'task', message: `New claimable chore: "${newTask.title}" (${newTask.reward} 💎)`, read: false, timestamp: Date.now(), targetRole: 'member' });
            } else if (newTask.assignedTo.length > 0) {
                notifs.push({ id: `notif_${Date.now()}`, type: 'task', message: `New chore assigned to you: "${newTask.title}" for ${newTask.reward} 💎`, read: false, timestamp: Date.now(), targetRole: 'member' });
            }
            return { tasks: [...state.tasks, newTask], notifications: [...notifs, ...state.notifications] };
        });
    },

    acceptTask: (taskId, userId) => {
        const task = get().tasks.find(t => t.id === taskId);
        const acceptingUser = get().mockUsers.find(u => u.id === userId);
        set((state) => ({
            tasks: state.tasks.map(t =>
                t.id === taskId && t.type === 'spontaneous' && t.status === 'open'
                    ? { ...t, status: 'accepted', assignedTo: [...t.assignedTo, userId], rejectionReason: undefined }
                    : t
            ),
            notifications: [
                { id: `notif_${Date.now()}`, type: 'task' as const, message: `${acceptingUser?.name.split(' ')[0] || 'A child'} claimed: "${task?.title || 'a chore'}" (${task?.reward} 💎)`, read: false, timestamp: Date.now(), targetRole: 'admin' as const },
                ...state.notifications,
            ],
        }));
    },

    rejectTask: (taskId, reason) => {
        const { tasks } = get();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        if (task.isAllowanceCashout) {
            set((state) => ({
                tasks: state.tasks.filter(t => t.id !== taskId),
                notifications: [{ id: `notif_${Date.now()}`, type: 'rejection' as const, message: 'Allowance cash out request declined.', read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
            }));
            Alert.alert('Declined', 'The cash out request was denied.');
            return;
        }
        if (task.isWithdrawal) {
            set((state) => ({
                tasks: state.tasks.filter(t => t.id !== taskId),
                vaultBalance: state.vaultBalance + task.reward,
                notifications: [{ id: `notif_${Date.now()}`, type: 'rejection' as const, message: 'Withdrawal request declined.', read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
            }));
            Alert.alert('Declined', 'Tokens safely returned to the vault.');
            return;
        }
        set((state) => ({
            tasks: state.tasks.map(t => t.id === taskId
                ? { ...t, status: t.type === 'spontaneous' ? 'accepted' : 'open', proofUrl: undefined, rejectionReason: reason }
                : t
            ),
            notifications: [{ id: `notif_${Date.now()}`, type: 'rejection' as const, message: 'A chore was sent back!', read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
        }));
        Alert.alert('Task Sent Back', 'The child has been notified to try again.');
    },

    submitCounterOffer: (taskId, userId, amount, reason) => {
        set((state) => ({
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'negotiating', proposedBy: userId, counterOfferAmount: amount, counterOfferReason: reason } : t),
            notifications: [{ id: `notif_${Date.now()}`, type: 'task' as const, message: `Someone is negotiating a chore!`, read: false, timestamp: Date.now(), targetRole: 'admin' as const }, ...state.notifications],
        }));
        Alert.alert('Offer Sent', 'Your counter-offer has been sent to the parents for review.');
    },

    acceptCounterOffer: (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task?.proposedBy) return;
        set((state) => ({
            tasks: state.tasks.map(t => t.id === taskId
                ? { ...t, status: 'accepted', assignedTo: [task.proposedBy!], reward: task.counterOfferAmount || task.reward, counterOfferAmount: undefined, counterOfferReason: undefined, proposedBy: undefined }
                : t
            ),
            notifications: [{ id: `notif_${Date.now()}`, type: 'approval' as const, message: `Your counter-offer for "${task.title}" was accepted at ${task.counterOfferAmount} 💎!`, read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
        }));
        Alert.alert('Offer Accepted', 'The chore has been assigned at the new rate!');
    },

    rejectCounterOffer: (taskId, reason) => {
        set((state) => ({
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'open', counterOfferAmount: undefined, counterOfferReason: undefined, proposedBy: undefined } : t),
            notifications: [{ id: `notif_${Date.now()}`, type: 'rejection' as const, message: `Your counter-offer was declined: ${reason}`, read: false, timestamp: Date.now(), targetRole: 'member' as const }, ...state.notifications],
        }));
        Alert.alert('Offer Declined', 'The chore is back on the open market.');
    },
});
