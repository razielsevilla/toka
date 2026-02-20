import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function MarketAlerts() {
  const { notifications, clearNotifications } = useTokaStore();
  const marketAlerts = notifications.filter(n => n.type === 'market_purchase' && !n.read);

  if (marketAlerts.length === 0) return null;

  return (
    <View style={styles.alertBanner}>
      <View style={styles.rowBetween}>
        <Text style={styles.alertTitle}>🔔 Market Claims</Text>
        <TouchableOpacity onPress={() => clearNotifications('market_purchase')}>
          <Text style={styles.dismissText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {marketAlerts.map(alert => (
        <View key={alert.id} style={styles.alertRow}>
          <Text style={styles.alertText}>• {alert.message}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertBanner: { backgroundColor: '#FFF3CD', margin: 15, padding: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#FFC107' },
  alertTitle: { fontWeight: 'bold', color: '#856404', fontSize: 14 },
  dismissText: { color: '#0984E3', fontWeight: 'bold', fontSize: 11 },
  alertRow: { marginTop: 5 },
  alertText: { fontSize: 13, color: '#856404' },
});