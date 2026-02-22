import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import TokaBank from '../../src/components/child/TokaBank';
import PeerTransfer from '../../src/components/child/PeerTransfer';
import Marketplace from '../../src/components/child/Marketplace';

export default function ChildEconomy() {
    const { Colors } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: Colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <TokaBank />
            <PeerTransfer />
            <Marketplace />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
