import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function PeerTransfer() {
    const { Colors, Typography } = useTheme();
    const { currentUser, user, mockUsers, transferTokens } = useTokaStore();
    const activeUser = currentUser || user;
    const [selectedSibling, setSelectedSibling] = useState<string | null>(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [memo, setMemo] = useState('');

    const siblings = mockUsers.filter(u => u.role === 'member' && u.id !== activeUser.id);

    const handleTransfer = () => {
        if (!selectedSibling) { Alert.alert('Missing Sibling', 'Select someone to send to!'); return; }
        const amountNum = parseInt(transferAmount, 10);
        if (!amountNum || isNaN(amountNum) || amountNum <= 0) { Alert.alert('Invalid Amount'); return; }
        if (amountNum > activeUser.tokens) { Alert.alert('Not Enough Tokens'); return; }
        transferTokens(selectedSibling, amountNum, memo || 'Just because!');
        setSelectedSibling(null); setTransferAmount(''); setMemo('');
    };

    if (siblings.length === 0) return null;

    return (
        <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <Ionicons name="cash" size={20} color={Colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.primary }]}>Pay a Sibling</Text>
            </View>
            <Text style={[styles.subtitle, { fontFamily: Typography.body, color: Colors.textDim }]}>Send tokens from your spendable balance.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                {siblings.map(sib => {
                    const active = selectedSibling === sib.id;
                    return (
                        <TouchableOpacity key={sib.id} style={[styles.sibCard, { borderColor: active ? Colors.primary : 'transparent', backgroundColor: active ? Colors.primary + '15' : Colors.surfaceLight }]} onPress={() => setSelectedSibling(sib.id)}>
                            <View style={[styles.sibAvatar, { backgroundColor: active ? Colors.primary : Colors.surfaceLight }]}>
                                <Text style={[styles.sibAvatarText, { color: active ? Colors.white : Colors.text }]}>{sib.name.charAt(0).toUpperCase()}</Text>
                            </View>
                            <Text style={[styles.sibName, { fontFamily: Typography.bodyBold, color: active ? Colors.primary : Colors.textDim }]}>{sib.name.split(' ')[0]}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {selectedSibling && (
                <View style={[styles.transferForm, { borderTopColor: Colors.surfaceLight }]}>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                        <TextInput style={[styles.input, { flex: 0.3, backgroundColor: Colors.surfaceLight, color: Colors.text, borderColor: Colors.surfaceLight, fontFamily: Typography.body }]} placeholder="Amt" placeholderTextColor={Colors.textDim} keyboardType="numeric" value={transferAmount} onChangeText={setTransferAmount} />
                        <TextInput style={[styles.input, { flex: 0.7, backgroundColor: Colors.surfaceLight, color: Colors.text, borderColor: Colors.surfaceLight, fontFamily: Typography.body }]} placeholder="What's this for?" placeholderTextColor={Colors.textDim} value={memo} onChangeText={setMemo} />
                    </View>
                    <TouchableOpacity style={[styles.sendBtn, { backgroundColor: Colors.primary }]} onPress={handleTransfer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Text style={[styles.sendBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Send Tokens</Text>
                            <Ionicons name="paper-plane" size={16} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 2, borderWidth: 1 },
    sectionTitle: { fontSize: 22 },
    subtitle: { fontSize: 12, marginBottom: 15 },
    sibCard: { alignItems: 'center', marginRight: 12, padding: 10, borderRadius: 15, borderWidth: 2 },
    sibAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
    sibAvatarText: { fontSize: 20, fontWeight: '800' },
    sibName: { fontSize: 12 },
    transferForm: { marginTop: 10, borderTopWidth: 1, paddingTop: 15 },
    input: { borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1 },
    sendBtn: { paddingVertical: 14, borderRadius: 15, alignItems: 'center' },
    sendBtnText: { fontSize: 16 },
});
