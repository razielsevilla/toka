import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function MarketManager() {
  const { Colors, Typography } = useTheme();
  const { marketItems, addMarketItem, removeMarketItem, auction, startAuction } = useTokaStore();
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [auctionName, setAuctionName] = useState('');
  const [auctionBid, setAuctionBid] = useState('');

  const handleAddReward = () => {
    if (!itemName || !itemCost) { Alert.alert('Error', 'Please enter reward name and cost.'); return; }
    addMarketItem({ name: itemName, cost: parseInt(itemCost), type: 'Custom Reward' });
    setItemName(''); setItemCost('');
  };

  const handleStartAuction = () => {
    if (!auctionName || !auctionBid) { Alert.alert('Error', 'Please enter auction item name and starting bid.'); return; }
    if (auction.isActive) { Alert.alert('Error', 'An auction is already running!'); return; }
    startAuction(auctionName, 300, parseInt(auctionBid));
    setAuctionName(''); setAuctionBid('');
  };

  return (
    <View style={[styles.section, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
      <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Manage Market Rewards</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <TextInput style={[styles.input, { flex: 0.6, backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="New Reward" placeholderTextColor={Colors.textDim} value={itemName} onChangeText={setItemName} />
        <TextInput style={[styles.input, { flex: 0.25, backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="Cost" keyboardType="numeric" value={itemCost} onChangeText={setItemCost} />
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: Colors.primary }]} onPress={handleAddReward}>
          <Text style={[styles.addBtnText, { color: Colors.white }]}>+</Text>
        </TouchableOpacity>
      </View>
      {marketItems.map(item => (
        <View key={item.id} style={[styles.marketRow, { borderBottomColor: Colors.surfaceLight }]}>
          <View>
            <Text style={[styles.marketItemName, { fontFamily: Typography.subheading, color: Colors.text }]}>{item.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="diamond" size={12} color={Colors.tertiary} />
              <Text style={[styles.marketItemCost, { color: Colors.tertiary, fontFamily: Typography.bodyBold }]}>{item.cost}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => removeMarketItem(item.id)}>
            <Text style={[styles.removeText, { color: Colors.danger, fontFamily: Typography.bodyBold }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 25, marginBottom: 15 }}>
        <Ionicons name="hammer" size={20} color={Colors.primary} />
        <Text style={[styles.sectionTitle, { fontFamily: Typography.heading, color: Colors.text }]}>Start an Auction</Text>
      </View>
      {auction.isActive ? (
        <View style={[styles.activeAuctionBox, { backgroundColor: Colors.danger + '15', borderColor: Colors.danger + '55' }]}>
          <Text style={[styles.auctionTitle, { fontFamily: Typography.subheading, color: Colors.danger }]}>Currently Auctioning: {auction.itemName}</Text>
          <Text style={[styles.auctionDetails, { fontFamily: Typography.body, color: Colors.textDim }]}>Highest Bid: {auction.highestBid} by {auction.highestBidder || 'No one'}</Text>
          <Text style={[styles.auctionDetails, { fontFamily: Typography.body, color: Colors.textDim }]}>Time Left: {Math.floor(auction.timeLeft / 60)}m {auction.timeLeft % 60}s</Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <TextInput style={[styles.input, { flex: 0.6, backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="Auction Item" placeholderTextColor={Colors.textDim} value={auctionName} onChangeText={setAuctionName} />
          <TextInput style={[styles.input, { flex: 0.25, backgroundColor: Colors.surfaceLight, color: Colors.text, fontFamily: Typography.body }]} placeholder="Start Bid" keyboardType="numeric" value={auctionBid} onChangeText={setAuctionBid} />
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: Colors.danger }]} onPress={handleStartAuction}>
            <Ionicons name="rocket" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 15, elevation: 3, borderWidth: 1 },
  sectionTitle: { fontSize: 22, marginBottom: 15 },
  input: { borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 0 },
  addBtn: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontSize: 24, fontWeight: 'bold' },
  marketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  marketItemName: { fontSize: 14 },
  marketItemCost: { fontSize: 12 },
  removeText: { fontSize: 12 },
  activeAuctionBox: { padding: 15, borderRadius: 10, borderWidth: 1 },
  auctionTitle: { fontSize: 14, marginBottom: 5 },
  auctionDetails: { fontSize: 12 },
});