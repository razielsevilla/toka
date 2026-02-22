import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';
import { useTheme } from '../theme/useTheme';

interface Props { visible: boolean; onClose: () => void; }

const getTimeSince = (time?: number) => {
    if (!time) return '';
    const diff = Date.now() - time;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const TYPE_COLOR: Record<string, string> = {
    task: '#6366F1', market: '#10B981', rejection: '#F43F5E',
    market_purchase: '#F59E0B', transfer: '#818CF8', achievement: '#FBBF24', approval: '#10B981',
};
const TYPE_ICON: Record<string, string> = {
    task: 'hammer', market: 'cart', rejection: 'close-circle',
    market_purchase: 'gift', transfer: 'swap-horizontal', achievement: 'trophy', approval: 'checkmark-circle',
};

export default function NotificationBoard({ visible, onClose }: Props) {
    const { notifications, clearAllNotifications, currentUser, user, setActiveTab, markNotificationAsRead } = useTokaStore();
    const { Colors, Typography } = useTheme();
    const activeRole = (currentUser || user).role;
    const myNotifications = notifications.filter(n => n.targetRole === activeRole || n.targetRole === 'all');

    const handlePress = (notif: any) => {
        markNotificationAsRead(notif.id); onClose();
        if (activeRole === 'admin') {
            setActiveTab(['approval', 'task'].includes(notif.type) ? 'review' : 'home');
        } else {
            const map: Record<string, string> = { task: 'home', rejection: 'home', approval: 'home', market: 'economy', transfer: 'economy', achievement: 'play' };
            setActiveTab(map[notif.type] || 'home');
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.sheet, { backgroundColor: Colors.surface }]}>
                            <View style={styles.rowBetween}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons name="notifications" size={20} color={Colors.primary} />
                                    <Text style={[styles.title, { fontFamily: Typography.heading, color: Colors.text }]}>Activity</Text>
                                </View>
                                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: Colors.surfaceLight }]}>
                                    <Ionicons name="close" size={20} color={Colors.textDim} />
                                </TouchableOpacity>
                            </View>

                            {myNotifications.length === 0 ? (
                                <View style={styles.empty}>
                                    <Ionicons name="checkmark-done-circle" size={48} color={Colors.textDim} />
                                    <Text style={[styles.emptyText, { color: Colors.textDim, fontFamily: Typography.body }]}>You're all caught up!</Text>
                                </View>
                            ) : (
                                <View style={{ gap: 10 }}>
                                    {myNotifications.slice(0, 10).map((notif, i) => (
                                        <TouchableOpacity
                                            key={notif.id || i}
                                            style={[styles.item, { borderBottomColor: Colors.surfaceLight }, notif.read && { opacity: 0.5 }]}
                                            onPress={() => handlePress(notif)}
                                        >
                                            <View style={[styles.iconBox, { backgroundColor: (TYPE_COLOR[notif.type] || Colors.primary) + '22' }]}>
                                                <Ionicons name={(TYPE_ICON[notif.type] || 'notifications') as any} size={16} color={TYPE_COLOR[notif.type] || Colors.primary} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.notifText, { color: Colors.text, fontFamily: Typography.bodyBold }]}>{notif.message}</Text>
                                                {!!notif.timestamp && <Text style={{ fontSize: 10, color: Colors.textDim, marginTop: 2 }}>{getTimeSince(notif.timestamp)}</Text>}
                                            </View>
                                            {!notif.read && <View style={[styles.dot, { backgroundColor: Colors.primary }]} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {myNotifications.length > 0 && (
                                <TouchableOpacity onPress={clearAllNotifications} style={[styles.clearBtn, { backgroundColor: Colors.surfaceLight }]}>
                                    <Text style={[styles.clearText, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Clear All</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 110 },
    sheet: { width: '90%', borderRadius: 25, padding: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 20 },
    closeBtn: { padding: 6, borderRadius: 12 },
    clearBtn: { paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginTop: 15 },
    clearText: { fontSize: 13 },
    empty: { alignItems: 'center', marginVertical: 30, gap: 10 },
    emptyText: { fontWeight: 'bold' },
    item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1 },
    iconBox: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
    notifText: { fontSize: 13 },
    dot: { width: 8, height: 8, borderRadius: 4 },
});
