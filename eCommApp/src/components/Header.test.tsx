import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

const renderHeader = () => {
    return render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    );
};

describe('Header', () => {
    it('renders the store name', () => {
        renderHeader();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('renders Home link', () => {
        renderHeader();
        const homeLink = screen.getByText('Home');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders Products link', () => {
        renderHeader();
        const productsLink = screen.getByText('Products');
        expect(productsLink).toBeInTheDocument();
        expect(productsLink.closest('a')).toHaveAttribute('href', '/products');
    });

    it('renders Cart link', () => {
        renderHeader();
        const cartLink = screen.getByText('Cart');
        expect(cartLink).toBeInTheDocument();
        expect(cartLink.closest('a')).toHaveAttribute('href', '/cart');
    });

    it('renders Admin Login button with link to login page', () => {
        renderHeader();
        const loginButton = screen.getByText('Admin Login');
        expect(loginButton).toBeInTheDocument();
        expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
    });

    it('renders header element', () => {
        renderHeader();
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders navigation element', () => {
        renderHeader();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
});
