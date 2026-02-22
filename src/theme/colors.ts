// ──────────────────────────────────────────────
// TOKA DESIGN SYSTEM
// ──────────────────────────────────────────────

export type ColorPalette = typeof LightColors;

export const LightColors = {
    primary: '#6366F1',       // Soft Indigo – primary actions
    secondary: '#F59E0B',     // Amber Gold – coins / tokens
    tertiary: '#10B981',      // Emerald – success, savings
    background: '#F0F4FF',    // Soft lavender-white canvas
    surface: '#FFFFFF',       // Card surface
    surfaceLight: '#E8EDFF',  // Subtle inset / panel
    text: '#1E293B',          // Strong slate – headings
    textDim: '#64748B',       // Muted body copy
    danger: '#F43F5E',        // Rose red – alerts
    success: '#10B981',       // Emerald green
    white: '#FFFFFF',
};

export const DarkColors: ColorPalette = {
    primary: '#818CF8',       // Lighter Indigo
    secondary: '#FBBF24',     // Lighter Amber
    tertiary: '#34D399',      // Lighter Emerald
    background: '#0F172A',    // Deep Slate
    surface: '#1E293B',       // Slate card surface
    surfaceLight: '#334155',  // Lighter slate borders
    text: '#F1F5F9',          // Off-white text
    textDim: '#94A3B8',       // Muted text
    danger: '#FB7185',        // Lighter coral
    success: '#34D399',
    white: '#FFFFFF',
};

export const Typography = {
    heading: 'Chewy_400Regular',
    subheading: 'Inter_700Bold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_700Bold',
};
