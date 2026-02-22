// ─── Notification Builder Helper ──────────────────────────────────────────────
// Eliminates the repeated inline notification object construction across slices.

import type { Notification, NotificationType, NotificationTarget } from '../../types';

/**
 * Builds a Notification object with a unique id and current timestamp.
 * Defaults targetRole to 'member' if omitted.
 */
export function buildNotif(
    type: NotificationType,
    message: string,
    targetRole: NotificationTarget = 'member'
): Notification {
    return {
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        message,
        read: false,
        timestamp: Date.now(),
        targetRole,
    };
}
