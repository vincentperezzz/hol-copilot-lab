import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

const renderHomePage = () => {
    return render(
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );
};

describe('HomePage', () => {
    it('renders the welcome heading', () => {
        renderHomePage();
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });

    it('renders the promotional text', () => {
        renderHomePage();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });

    it('renders Header with store name', () => {
        renderHomePage();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('renders Footer with copyright', () => {
        renderHomePage();
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });
});
