import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function TokaBank() {
  const { currentUser, transactions, depositToVault, withdrawFromVault, vaultBalance, tasks } = useTokaStore();
  const [showHistory, setShowHistory] = useState(false);
  const [bankAmount, setBankAmount] = useState('');

  const userTokens = currentUser?.tokens || 0;
  const isPending = tasks.some(t => t.isWithdrawal && t.status === 'pending');

  return (
    <View style={styles.bankCard}>
      <View style={styles.bankHeader}>
        <Text style={styles.bankTitle}>🏦 Toka Bank</Text>
        <TouchableOpacity style={styles.historyBtnSmall} onPress={() => setShowHistory(true)}>
          <Text style={styles.historyBtnText}>History 📜</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bankMainRow}>
        <View style={styles.accountBox}>
          <Text style={styles.accountLabel}>SPENDABLE</Text>
          <Text style={styles.accountAmount}>💰 {userTokens}</Text>
        </View>
        <View style={styles.bankDivider} />
        <View style={styles.accountBox}>
          <Text style={styles.accountLabel}>VAULT SAVINGS</Text>
          <Text style={styles.vaultAmountMain}>💎 {vaultBalance}</Text>
          {isPending && <Text style={styles.pendingText}>⏳ Withdrawal Pending...</Text>}
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput 
          style={styles.bankInput}
          placeholder="Amount"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="numeric"
          value={bankAmount}
          onChangeText={setBankAmount}
        />
      </View>

      <View style={styles.bankActionRow}>
        <TouchableOpacity 
          style={[styles.bankActionBtn, { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]} 
          onPress={() => { depositToVault(Number(bankAmount)); setBankAmount(''); }}
        >
          <Text style={styles.bankActionText}>Save 📥</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bankActionBtn} 
          onPress={() => { withdrawFromVault(Number(bankAmount)); setBankAmount(''); }}
        >
          <Text style={styles.bankActionText}>Take Out 📤</Text>
        </TouchableOpacity>
      </View>

      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Activity Ledger</Text>
          <ScrollView>
            {transactions.map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <Text style={tx.type === 'earn' ? styles.txEarn : styles.txSpend}>{tx.type === 'earn' ? '+' : '-'}{tx.amount}</Text>
                <Text style={styles.txReason}>{tx.reason}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHistory(false)}>
            <Text style={styles.btnText}>Return to App</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bankCard: { backgroundColor: '#6C5CE7', margin: 15, borderRadius: 25, paddingVertical: 20, elevation: 8 },
  bankHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  bankTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  historyBtnSmall: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  historyBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  bankMainRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  accountBox: { alignItems: 'center', flex: 1 },
  accountLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '900', marginBottom: 5 },
  accountAmount: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  vaultAmountMain: { color: '#FDCB6E', fontSize: 24, fontWeight: '900' },
  bankDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
  inputWrapper: { paddingHorizontal: 40, marginBottom: 15 },
  bankInput: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#FFF', textAlign: 'center', fontSize: 18, fontWeight: 'bold', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  bankActionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: 10 },
  bankActionBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  bankActionText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  pendingText: { color: '#F39C12', fontSize: 8, fontWeight: 'bold', marginTop: 5 },
  modalContainer: { flex: 1, padding: 30, backgroundColor: '#FFF' },
  modalTitle: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
  txRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  txEarn: { color: '#00B894', fontWeight: 'bold', width: 40 },
  txSpend: { color: '#D63031', fontWeight: 'bold', width: 40 },
  txReason: { flex: 1, color: '#2D3436', fontSize: 13 },
  closeBtn: { backgroundColor: '#2D3436', padding: 15, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});