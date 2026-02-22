import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function MarketAlerts() {
  const { Colors, Typography } = useTheme();
  const { notifications, clearNotifications } = useTokaStore();
  const marketAlerts = notifications.filter(n => n.type === 'market_purchase' && !n.read);
  if (marketAlerts.length === 0) return null;

  return (
    <View style={[styles.alertBanner, { backgroundColor: Colors.secondary + '22', borderLeftColor: Colors.secondary }]}>
      <View style={styles.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="notifications" size={16} color={Colors.secondary} />
          <Text style={[styles.alertTitle, { fontFamily: Typography.subheading, color: Colors.secondary }]}>Market Claims</Text>
        </View>
        <TouchableOpacity onPress={() => clearNotifications('market_purchase')}>
          <Text style={[styles.dismissText, { color: Colors.primary, fontFamily: Typography.bodyBold }]}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {marketAlerts.map(alert => (
        <View key={alert.id} style={{ marginTop: 5 }}>
          <Text style={[styles.alertText, { fontFamily: Typography.body, color: Colors.text }]}>• {alert.message}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertBanner: { margin: 15, padding: 15, borderRadius: 15, borderLeftWidth: 5 },
  alertTitle: { fontSize: 14 },
  dismissText: { fontSize: 11 },
  alertText: { fontSize: 13 },
});