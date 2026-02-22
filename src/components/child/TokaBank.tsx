import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function TokaBank() {
  const { Colors, Typography } = useTheme();
  const { currentUser, transactions, depositToVault, withdrawFromVault, vaultBalance, tasks } = useTokaStore();
  const [showHistory, setShowHistory] = useState(false);
  const [bankAmount, setBankAmount] = useState('');
  const userTokens = currentUser?.tokens || 0;
  const isPending = tasks.some(t => t.isWithdrawal && t.status === 'pending');

  return (
    <View style={[styles.bankCard, { backgroundColor: Colors.primary }]}>
      <View style={styles.bankHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="business" size={20} color={Colors.white} />
          <Text style={[styles.bankTitle, { color: Colors.white, fontFamily: Typography.heading }]}>Toka Bank</Text>
        </View>
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.historyBtnText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>History</Text>
            <Ionicons name="receipt" size={12} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bankMainRow}>
        <View style={styles.accountBox}>
          <Text style={[styles.accountLabel, { color: 'rgba(255,255,255,0.65)', fontFamily: Typography.bodyBold }]}>SPENDABLE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="wallet" size={22} color={Colors.white} />
            <Text style={[styles.accountAmount, { color: Colors.white, fontFamily: Typography.heading }]}>{userTokens}</Text>
          </View>
        </View>
        <View style={styles.bankDivider} />
        <View style={styles.accountBox}>
          <Text style={[styles.accountLabel, { color: 'rgba(255,255,255,0.65)', fontFamily: Typography.bodyBold }]}>VAULT SAVINGS</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="diamond" size={22} color={Colors.secondary} />
            <Text style={[styles.accountAmount, { color: Colors.secondary, fontFamily: Typography.heading }]}>{vaultBalance}</Text>
            <View style={[styles.interestTag, { backgroundColor: Colors.tertiary }]}>
              <Text style={{ color: Colors.white, fontSize: 10, fontWeight: '900' }}>+5%</Text>
            </View>
          </View>
          {isPending && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
              <Ionicons name="hourglass" size={10} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 'bold' }}>Withdrawal Pending...</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 40, marginBottom: 15 }}>
        <TextInput
          style={[styles.bankInput, { color: Colors.white, fontFamily: Typography.subheading }]}
          placeholder="Amount"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="numeric"
          value={bankAmount}
          onChangeText={setBankAmount}
        />
      </View>

      <View style={[styles.bankActionRow, { borderTopColor: 'rgba(255,255,255,0.12)' }]}>
        <TouchableOpacity style={[styles.bankActionBtn, { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }]} onPress={() => { depositToVault(Number(bankAmount)); setBankAmount(''); }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.bankActionText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>Save</Text>
            <Ionicons name="download" size={14} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bankActionBtn} onPress={() => { withdrawFromVault(Number(bankAmount)); setBankAmount(''); }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.bankActionText, { color: Colors.white, fontFamily: Typography.bodyBold }]}>Take Out</Text>
            <Ionicons name="log-out" size={14} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={showHistory} animationType="slide">
        <View style={[styles.modalContainer, { flex: 1, backgroundColor: Colors.background, padding: 30 }]}>
          <Text style={[styles.modalTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Activity Ledger</Text>
          <ScrollView>
            {transactions.map(tx => (
              <View key={tx.id} style={[styles.txRow, { borderBottomColor: Colors.surfaceLight }]}>
                <Text style={[styles.txAmt, { color: tx.type === 'earn' ? Colors.tertiary : Colors.danger, fontFamily: Typography.bodyBold }]}>{tx.type === 'earn' ? '+' : '-'}{tx.amount}</Text>
                <Text style={[styles.txReason, { color: Colors.textDim, fontFamily: Typography.body }]}>{tx.reason}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: Colors.primary, borderRadius: 15 }]} onPress={() => setShowHistory(false)}>
            <Text style={[styles.closeBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Return to App</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bankCard: { margin: 15, borderRadius: 25, paddingVertical: 20, elevation: 8 },
  bankHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  bankTitle: { fontSize: 20 },
  historyBtn: { backgroundColor: 'rgba(255,255,255,0.18)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  historyBtnText: { fontSize: 11 },
  bankMainRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  accountBox: { alignItems: 'center', flex: 1 },
  accountLabel: { fontSize: 9, marginBottom: 5 },
  accountAmount: { fontSize: 24 },
  bankDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.12)' },
  bankInput: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12, textAlign: 'center', fontSize: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  bankActionRow: { flexDirection: 'row', borderTopWidth: 1, marginTop: 10 },
  bankActionBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  bankActionText: { fontSize: 12 },
  interestTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 4 },
  modalContainer: {},
  modalTitle: { fontSize: 24, marginBottom: 20 },
  txRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  txAmt: { width: 40 },
  txReason: { flex: 1, fontSize: 13 },
  closeBtn: { padding: 15, marginTop: 20, alignItems: 'center' },
  closeBtnText: { fontSize: 14 },
});