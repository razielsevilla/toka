import { View, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserProfile from '../src/components/UserProfile';
import { useTheme } from '../src/theme/useTheme';

export default function Profile() {
    const router = useRouter();
    const { Colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={[styles.header, { borderBottomColor: Colors.surfaceLight }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="close" size={28} color={Colors.text} />
                </TouchableOpacity>
            </View>
            <UserProfile />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        alignItems: 'flex-end',
    },
    backBtn: {
        padding: 5,
    },
});
