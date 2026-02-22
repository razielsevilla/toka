import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTokaStore } from '../../store/useTokaStore';
import { useTheme } from '../../theme/useTheme';

export default function TokenToss() {
    const { Colors, Typography } = useTheme();
    const { currentUser, addTokens } = useTokaStore();
    const [tossing, setTossing] = useState(false);
    const [result, setResult] = useState<'won' | 'lost' | null>(null);

    const cost = 10;

    const handleToss = () => {
        if (!currentUser || currentUser.tokens < cost) {
            Alert.alert("Not enough tokens", "You need at least 10 💎 to play!");
            return;
        }

        Alert.alert(
            "Double or Nothing!",
            `Wager ${cost} 💎 on a coin flip?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Flip it!",
                    onPress: () => {
                        setTossing(true);
                        setResult(null);

                        // Deduct tokens initially
                        addTokens(-cost, 'Token Toss Wager');

                        setTimeout(() => {
                            const won = Math.random() > 0.5;
                            if (won) {
                                // Win 20 back (net +10)
                                addTokens(cost * 2, 'Token Toss WON!');
                                setResult('won');
                            } else {
                                setResult('lost');
                            }
                            setTossing(false);
                        }, 1000);
                    }
                }
            ]
        );
    };

    if (!currentUser) return null;

    return (
        <View style={[styles.container, { backgroundColor: Colors.surface, borderColor: Colors.surfaceLight }]}>
            <View style={styles.header}>
                <Ionicons name="game-controller" size={24} color={Colors.tertiary} />
                <Text style={[styles.title, { fontFamily: Typography.heading, color: Colors.text }]}>Mini Game</Text>
            </View>
            <Text style={[styles.desc, { fontFamily: Typography.body, color: Colors.textDim }]}>Wager 10 💎. Double it or lose it!</Text>

            <TouchableOpacity
                style={[styles.btn, { backgroundColor: tossing ? Colors.surfaceLight : Colors.tertiary, borderColor: Colors.tertiary }]}
                onPress={handleToss}
                disabled={tossing}
            >
                <Text style={[styles.btnText, { fontFamily: Typography.subheading, color: tossing ? Colors.textDim : Colors.white }]}>
                    {tossing ? "Flipping..." : "Play Token Toss"}
                </Text>
            </TouchableOpacity>

            {result === 'won' && (
                <View style={[styles.resultBox, { backgroundColor: Colors.secondary + '20', borderColor: Colors.secondary }]}>
                    <Text style={{ fontFamily: Typography.bodyBold, color: Colors.secondary }}>🎉 WINNER! You doubled your tokens!</Text>
                </View>
            )}
            {result === 'lost' && (
                <View style={[styles.resultBox, { backgroundColor: Colors.danger + '20', borderColor: Colors.danger }]}>
                    <Text style={{ fontFamily: Typography.bodyBold, color: Colors.danger }}>💀 OOF! Better luck next time.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, borderRadius: 25, marginHorizontal: 15, marginBottom: 15, elevation: 5, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, borderWidth: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
    title: { fontSize: 22 },
    desc: { fontSize: 13, marginBottom: 15 },
    btn: { padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1 },
    btnText: { fontSize: 16 },
    resultBox: { padding: 10, borderRadius: 10, marginTop: 15, borderWidth: 1, alignItems: 'center' },
});
