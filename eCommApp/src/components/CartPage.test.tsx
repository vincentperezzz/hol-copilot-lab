import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <BrowserRouter>
            <CartContext.Provider value={cartContext}>
                <CartPage />
            </CartContext.Provider>
        </BrowserRouter>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('shows empty cart message when no items', () => {
        renderWithCartContext({
            cartItems: [],
            addToCart: vi.fn(),
            clearCart: vi.fn()
        });
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('does not show checkout button when cart is empty', () => {
        renderWithCartContext({
            cartItems: [],
            addToCart: vi.fn(),
            clearCart: vi.fn()
        });
        expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
    });

    it('shows checkout button when cart has items', () => {
        renderWithCartContext();
        expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    it('shows checkout modal when Checkout is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        await user.click(screen.getByText('Checkout'));
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Continue Checkout')).toBeInTheDocument();
    });

    it('cancels checkout and hides modal', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        await user.click(screen.getByText('Checkout'));
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();

        await user.click(screen.getByText('Return to cart'));
        expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    });

    it('confirms checkout, clears cart, and shows order processed', async () => {
        const user = userEvent.setup();
        const clearCart = vi.fn();
        renderWithCartContext({
            ...mockCartContext,
            clearCart
        });
        await user.click(screen.getByText('Checkout'));
        await user.click(screen.getByText('Continue Checkout'));

        expect(clearCart).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('renders Header and Footer', () => {
        renderWithCartContext();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('renders Header and Footer in order processed view', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        await user.click(screen.getByText('Checkout'));
        await user.click(screen.getByText('Continue Checkout'));
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('throws error when used outside CartProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            render(
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            );
        }).toThrow('CartContext must be used within a CartProvider');
        consoleSpy.mockRestore();
    });

    it('renders product images in cart', () => {
        renderWithCartContext();
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('alt', 'Test Product 1');
        expect(images[1]).toHaveAttribute('alt', 'Test Product 2');
    });
});
