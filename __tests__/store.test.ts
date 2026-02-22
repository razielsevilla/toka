import { renderHook, act } from '@testing-library/react-native';
import { useTokaStore } from '../src/store/useTokaStore';

describe('Toka Store Tests', () => {
    it('initial state should have light theme', () => {
        const { result } = renderHook(() => useTokaStore());
        expect(result.current.theme).toBe('light');
    });

    it('can logout correctly', () => {
        const { result } = renderHook(() => useTokaStore());
        act(() => {
            result.current.logout();
        });
        expect(result.current.currentUser).toBeNull();
    });
});
