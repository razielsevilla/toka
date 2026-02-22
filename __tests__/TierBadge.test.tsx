import React from 'react';
import { render } from '@testing-library/react-native';
import { TierBadge } from '../src/components/child/marketplace/TierBadge';

describe('TierBadge Rendering', () => {
    it('renders legendary correctly', () => {
        const { getByText } = render(<TierBadge tier="legendary" />);
        expect(getByText(/LEGENDARY/i)).toBeTruthy();
    });

    it('renders uncommon correctly', () => {
        const { getByText } = render(<TierBadge tier="uncommon" />);
        expect(getByText(/UNCOMMON/i)).toBeTruthy();
    });
});
