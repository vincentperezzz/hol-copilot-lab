import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock fetch for ProductsPage which loads product JSON files
beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                id: '1',
                name: 'Apple',
                price: 1.99,
                description: 'Fresh apple',
                image: 'apple.png',
                reviews: [],
                inStock: true
            })
        } as Response);
    });
});

const renderApp = (initialRoute = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <App />
        </MemoryRouter>
    );
};

describe('App', () => {
    it('renders HomePage on "/" route', () => {
        renderApp('/');
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });

    it('renders ProductsPage on "/products" route', async () => {
        renderApp('/products');
        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });
    });

    it('renders LoginPage on "/login" route', () => {
        renderApp('/login');
        expect(screen.getByText('Admin Login', { selector: 'h2' })).toBeInTheDocument();
    });

    it('renders AdminPage on "/admin" route', () => {
        renderApp('/admin');
        expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
    });

    it('renders CartPage on "/cart" route', () => {
        renderApp('/cart');
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });
});
