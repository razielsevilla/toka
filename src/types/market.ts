import type { Frequency } from './task';

export interface MarketItem {
    id: string;
    name: string;
    cost: number;
    type: string;
    originalCost?: number;
    saleUntil?: number;
}

export interface Auction {
    itemName: string;
    highestBid: number;
    highestBidder: string | null;
    timeLeft: number; // seconds
    isActive: boolean;
}

export interface ShopSlot {
    itemId: string;
    stock: number;
    expiresAt: number;
}

export interface DailyShop {
    lastRefresh: number;
    slots: ShopSlot[];
}
