import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function PeerTransfer() {
    const { currentUser, user, mockUsers, transferTokens } = useTokaStore();
    const activeUser = currentUser || user;

    const [selectedSibling, setSelectedSibling] = useState<string | null>(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [memo, setMemo] = useState('');

    // Get other members in the household who are NOT the current user
    const siblings = mockUsers.filter(u => u.role === 'member' && u.id !== activeUser.id);

    const handleTransfer = () => {
        if (!selectedSibling) {
            Alert.alert("Missing Sibling", "Please select someone to send tokens to!");
            return;
        }

        const amountNum = parseInt(transferAmount, 10);
        if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
            Alert.alert("Invalid Amount", "Please enter a valid amount of tokens.");
            return;
        }

        if (amountNum > activeUser.tokens) {
            Alert.alert("Not Enough Tokens", "You don't have enough spendable tokens for this transfer.");
            return;
        }

        transferTokens(selectedSibling, amountNum, memo || 'Just because!');

        setSelectedSibling(null);
        setTransferAmount('');
        setMemo('');
    };

    if (siblings.length === 0) return null; // Hide module if they are an only child in the app

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>💸 Pay a Sibling</Text>
            <Text style={styles.sectionSubtitle}>Send tokens from your Wallet Balance.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.siblingScroller}>
                {siblings.map(sib => (
                    <TouchableOpacity
                        key={sib.id}
                        style={[styles.siblingCard, selectedSibling === sib.id && styles.siblingCardActive]}
                        onPress={() => setSelectedSibling(sib.id)}
                    >
                        <View style={styles.siblingAvatar}>
                            <Text style={styles.siblingAvatarText}>{sib.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={[styles.siblingName, selectedSibling === sib.id && styles.siblingNameActive]}>
                            {sib.name.split(' ')[0]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {selectedSibling && (
                <View style={styles.transferForm}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.input, { flex: 0.3 }]}
                            placeholder="Amt 💎"
                            keyboardType="numeric"
                            value={transferAmount}
                            onChangeText={setTransferAmount}
                        />
                        <TextInput
                            style={[styles.input, { flex: 0.7 }]}
                            placeholder="What's this for?"
                            value={memo}
                            onChangeText={setMemo}
                        />
                    </View>
                    <TouchableOpacity style={styles.sendBtn} onPress={handleTransfer}>
                        <Text style={styles.sendBtnText}>Send Tokens ✨</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436' },
    sectionSubtitle: { fontSize: 12, color: '#636E72', marginBottom: 15 },

    siblingScroller: { marginBottom: 10 },
    siblingCard: { alignItems: 'center', marginRight: 15, padding: 10, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' },
    siblingCardActive: { borderColor: '#A29BFE', backgroundColor: '#F4F1FF' },
    siblingAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#DFE6E9', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
    siblingAvatarText: { fontSize: 20, fontWeight: '800', color: '#2D3436' },
    siblingName: { fontSize: 12, fontWeight: '700', color: '#636E72' },
    siblingNameActive: { color: '#6C5CE7' },

    transferForm: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F1F2F6', paddingTop: 15 },
    inputRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#EEE', color: '#2D3436' },
    sendBtn: { backgroundColor: '#6C5CE7', paddingVertical: 14, borderRadius: 15, alignItems: 'center' },
    sendBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
