import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../store/useTokaStore';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const getTimeSince = (time?: number) => {
    if (!time) return '';
    const diff = Date.now() - time;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export default function NotificationBoard({ visible, onClose }: Props) {
    const { notifications, clearAllNotifications, currentUser, user, setActiveTab, markNotificationAsRead } = useTokaStore();
    const activeRole = (currentUser || user).role;
    const myNotifications = notifications.filter(n => n.targetRole === activeRole || n.targetRole === 'all');

    const handleNotificationPress = (notif: any) => {
        markNotificationAsRead(notif.id);
        onClose();

        if (activeRole === 'admin') {
            switch (notif.type) {
                case 'approval':
                case 'task':
                    setActiveTab('review');
                    break;
                case 'market':
                case 'market_purchase':
                    setActiveTab('home');
                    break;
                default:
                    setActiveTab('home');
            }
        } else {
            switch (notif.type) {
                case 'task':
                case 'rejection':
                case 'approval':
                    setActiveTab('home');
                    break;
                case 'market':
                case 'transfer':
                    setActiveTab('economy');
                    break;
                case 'achievement':
                    setActiveTab('play');
                    break;
                default:
                    setActiveTab('home');
            }
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'task': return 'hammer';
            case 'market': return 'cart';
            case 'rejection': return 'close-circle';
            case 'market_purchase': return 'gift';
            default: return 'notifications';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'task': return '#0984E3';
            case 'market': return '#00B894';
            case 'rejection': return '#D63031';
            case 'market_purchase': return '#FDCB6E';
            default: return '#6C5CE7';
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.rowBetween}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons name="notifications" size={20} color="#2D3436" />
                                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                                </View>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <Ionicons name="close" size={20} color="#636E72" />
                                </TouchableOpacity>
                            </View>

                            {myNotifications.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="checkmark-done-circle" size={48} color="#B2BEC3" />
                                    <Text style={styles.emptyText}>You're all caught up!</Text>
                                </View>
                            ) : (
                                <View style={styles.notifContainer}>
                                    {myNotifications.slice(0, 10).map((notif, index) => (
                                        <TouchableOpacity
                                            key={notif.id || index.toString()}
                                            style={[styles.notifItem, notif.read && styles.readNotif]}
                                            onPress={() => handleNotificationPress(notif)}
                                        >
                                            <View style={[styles.iconBox, { backgroundColor: getColor(notif.type) + '20' }]}>
                                                <Ionicons name={getIcon(notif.type) as any} size={16} color={getColor(notif.type)} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.notifText, notif.read && styles.readText]}>{notif.message}</Text>
                                                {!!notif.timestamp && <Text style={styles.timeText}>{getTimeSince(notif.timestamp)}</Text>}
                                            </View>
                                            {!notif.read && <View style={styles.unreadDot} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {myNotifications.length > 0 && (
                                <TouchableOpacity onPress={clearAllNotifications} style={styles.clearBtn}>
                                    <Text style={styles.clearText}>Clear All</Text>
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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 100 },
    modalContent: { backgroundColor: '#FFF', width: '90%', borderRadius: 25, padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436' },
    closeBtn: { padding: 4, backgroundColor: '#F1F2F6', borderRadius: 12 },
    clearBtn: { backgroundColor: '#F1F2F6', paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginTop: 15 },
    clearText: { color: '#636E72', fontSize: 13, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', marginVertical: 30, gap: 10 },
    emptyText: { color: '#B2BEC3', fontWeight: 'bold' },
    notifContainer: { gap: 10 },
    notifItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
    iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    notifText: { fontSize: 13, color: '#2D3436', fontWeight: '600' },
    timeText: { fontSize: 10, color: '#B2BEC3', marginTop: 2 },
    readNotif: { opacity: 0.6 },
    readText: { color: '#636E72', fontWeight: '500' },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D63031' }
});
