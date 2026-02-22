import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/useTheme';

import ApprovalQueue from '../../src/components/parent/ApprovalQueue';

export default function ParentReview() {
    const { Colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: Colors.background, paddingTop: 10 }]}>
            <ApprovalQueue />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },
});
