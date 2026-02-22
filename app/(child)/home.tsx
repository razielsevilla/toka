import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import WishlistHero from '../../src/components/child/WishlistHero';
import ChoreBoard from '../../src/components/child/ChoreBoard';

export default function ChildHome() {
    const { Colors } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: Colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <WishlistHero />
            <ChoreBoard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
