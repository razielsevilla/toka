import { SafeAreaView, StyleSheet } from 'react-native';
import UserProfile from '../src/components/UserProfile';
import { useTheme } from '../src/theme/useTheme';

export default function Profile() {
    const { Colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <UserProfile />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
