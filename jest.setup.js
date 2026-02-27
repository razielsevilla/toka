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


jest.mock('expo-device', () => ({
    isDevice: true,
}));

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});
