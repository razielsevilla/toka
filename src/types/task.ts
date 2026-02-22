export type TaskStatus = 'open' | 'accepted' | 'pending' | 'completed' | 'negotiating';
export type TaskType = 'regular' | 'spontaneous';
export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Task {
    id: string;
    title: string;
    reward: number;
    status: TaskStatus;
    type: TaskType;
    frequency?: Frequency;
    assignedTo: string[];
    proofUrl?: string;
    rejectionReason?: string;
    isWithdrawal?: boolean;
    isAllowanceCashout?: boolean;
    counterOfferAmount?: number;
    counterOfferReason?: string;
    proposedBy?: string;
    deadline?: number;
}
