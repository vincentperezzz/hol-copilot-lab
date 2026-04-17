import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('renders the copyright text', () => {
        render(<Footer />);
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('renders the "All rights reserved" text', () => {
        render(<Footer />);
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('renders a footer element', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});
