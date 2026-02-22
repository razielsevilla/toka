export type NotificationType =
    | 'task' | 'market' | 'rejection' | 'market_purchase'
    | 'transfer' | 'achievement' | 'approval';

export type NotificationTarget = 'admin' | 'member' | 'all';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    timestamp: number;
    targetRole: NotificationTarget;
}
