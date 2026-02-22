import { Redirect } from 'expo-router';
import { useTokaStore } from '../src/store/useTokaStore';

export default function Index() {
    const { currentUser } = useTokaStore();

    if (!currentUser) {
        return <Redirect href="/(auth)/login" />;
    }

    if (currentUser.role === 'admin') {
        return <Redirect href="/(parent)/home" />;
    }

    return <Redirect href="/(child)/home" />;
}
