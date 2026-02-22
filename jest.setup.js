import '@testing-library/jest-native/extend-expect';

jest.mock('expo-font', () => ({
    useFonts: () => [true],
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
    useSegments: () => ['(child)'],
    Link: 'Link',
    Stack: {
        Screen: 'Stack.Screen'
    },
    Tabs: {
        Screen: 'Tabs.Screen'
    }
}));

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    addNotificationReceivedListener: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
    removeNotificationSubscription: jest.fn(),
    setNotificationChannelAsync: jest.fn(),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
    scheduleNotificationAsync: jest.fn(),
}));

jest.mock('expo-device', () => ({
    isDevice: true,
}));

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});
