import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTokaStore } from '../../store/useTokaStore';

export default function MarketManager() {
  const { marketItems, addMarketItem, removeMarketItem } = useTokaStore();
  
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');

  const handleAddReward = () => {
    if (!itemName || !itemCost) {
      Alert.alert("Error", "Please enter reward name and cost.");
      return;
    }
    addMarketItem({ 
      name: itemName, 
      cost: parseInt(itemCost), 
      type: 'Custom Reward' 
    });
    setItemName('');
    setItemCost('');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Manage Market Rewards</Text>
      <View style={styles.addRewardForm}>
        <TextInput 
          style={[styles.input, { flex: 0.6, marginBottom: 0 }]} 
          placeholder="New Reward" 
          placeholderTextColor="#999" 
          value={itemName} 
          onChangeText={setItemName} 
        />
        <TextInput 
          style={[styles.input, { flex: 0.25, marginBottom: 0 }]} 
          placeholder="Cost" 
          keyboardType="numeric" 
          value={itemCost} 
          onChangeText={setItemCost} 
        />
        <TouchableOpacity style={styles.addBtnSmall} onPress={handleAddReward}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      {marketItems.map(item => (
        <View key={item.id} style={styles.marketEditRow}>
          <View>
            <Text style={styles.marketItemName}>{item.name}</Text>
            <Text style={styles.marketItemCost}>💎 {item.cost}</Text>
          </View>
          <TouchableOpacity onPress={() => removeMarketItem(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2D3436', marginBottom: 15 },
  input: { backgroundColor: '#F1F2F6', borderRadius: 10, padding: 12, fontSize: 14, color: '#2D3436', marginBottom: 15 },
  addRewardForm: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  addBtnSmall: { backgroundColor: '#6C5CE7', width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  marketEditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  marketItemName: { fontSize: 14, fontWeight: '600', color: '#2D3436' },
  marketItemCost: { fontSize: 12, color: '#00B894', fontWeight: 'bold' },
  removeText: { color: '#D63031', fontSize: 12, fontWeight: 'bold' },
});