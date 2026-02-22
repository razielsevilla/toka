import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import WishlistHero from '../../src/components/child/WishlistHero';
import ChoreBoard from '../../src/components/child/ChoreBoard';

export default function ChildHome() {
    const { Colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: Colors.background, paddingTop: 10 }]}>
            <ChoreBoard header={<WishlistHero />} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
