import type { Frequency } from './task';

export interface Transaction {
    id: string;
    amount: number;
    type: 'earn' | 'spend';
    reason: string;
    timestamp: number;
}

export interface Bill {
    id: string;
    title: string;
    amount: number;
    frequency: Frequency;
}
