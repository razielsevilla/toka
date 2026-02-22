import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function MiniGames() {
    const { Colors, Typography } = useTheme();
    const { playDoubleOrNothing, currentUser, user } = useTokaStore();
    const [wager, setWager] = useState('');
    const animationRef = useRef<LottieView>(null);
    const activeUser = currentUser || user;
    const tokens = activeUser.tokens || 0;

    const handlePlay = () => {
        const wagerAmount = parseInt(wager, 10);
        if (isNaN(wagerAmount) || wagerAmount <= 0) { Alert.alert('Invalid Wager', 'Please enter a valid amount.'); return; }
        if (wagerAmount > tokens) { Alert.alert('Not Enough Tokens', `You only have ${tokens} 💎 to play with.`); return; }
        Alert.alert('Double or Nothing! 🎲', `Risk ${wagerAmount} 💎?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Roll the Dice!', onPress: () => {
                    const result = playDoubleOrNothing(wagerAmount);
                    if (result === 'win') {
                        animationRef.current?.play();
                        setTimeout(() => Alert.alert('🎉 YOU WON! 🎉', `You doubled your wager and earned ${wagerAmount} 💎!`), 1000);
                    } else {
                        Alert.alert('😢 Oh no!', `You lost ${wagerAmount} 💎. Better luck next time!`);
                    }
                    setWager('');
                }
            }
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.surface, borderColor: Colors.primary + '66' }]}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: 'none', alignItems: 'center', justifyContent: 'center' }}>
                <LottieView ref={animationRef} source={require('../../../assets/lottie/success.json')} loop={false} style={{ width: 150, height: 150 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <Ionicons name="dice" size={20} color={Colors.primary} />
                <Text style={[styles.title, { fontFamily: Typography.heading, color: Colors.primary }]}>Double or Nothing</Text>
            </View>
            <Text style={[styles.subtitle, { fontFamily: Typography.body, color: Colors.textDim }]}>Feeling lucky? Risk your tokens for a chance to instantly double them!</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                    style={[styles.input, { flex: 0.6, backgroundColor: Colors.surfaceLight, color: Colors.text, borderColor: Colors.primary + '44', fontFamily: Typography.body }]}
                    placeholder="Enter wager"
                    placeholderTextColor={Colors.textDim}
                    keyboardType="numeric"
                    value={wager}
                    onChangeText={setWager}
                />
                <TouchableOpacity style={[styles.playBtn, { flex: 0.4, backgroundColor: Colors.primary }]} onPress={handlePlay}>
                    <Text style={[styles.playBtnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Play!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 4, borderWidth: 2 },
    title: { fontSize: 20 },
    subtitle: { fontSize: 12, marginBottom: 15 },
    input: { borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1 },
    playBtn: { borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    playBtnText: { fontSize: 16 },
});
