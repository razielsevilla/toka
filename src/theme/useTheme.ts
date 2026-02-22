import { useTokaStore } from '../store/useTokaStore';
import { LightColors, DarkColors, Typography, ColorPalette } from './colors';

export function useTheme(): { Colors: ColorPalette; Typography: typeof Typography; isDark: boolean } {
    const theme = useTokaStore(s => s.theme);
    const isDark = theme === 'dark';
    return {
        Colors: isDark ? DarkColors : LightColors,
        Typography,
        isDark,
    };
}
