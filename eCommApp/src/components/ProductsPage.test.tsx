import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';

const mockProducts = [
    {
        id: '1',
        name: 'Apple',
        price: 1.99,
        description: 'Fresh apple',
        image: 'apple.png',
        reviews: [{ author: 'John', comment: 'Good', date: '2025-01-01' }],
        inStock: true
    },
    {
        id: '2',
        name: 'Orange',
        price: 2.49,
        description: 'Juicy orange',
        image: 'orange.png',
        reviews: [],
        inStock: false
    },
    {
        id: '3',
        name: 'Grapes',
        price: 3.99,
        description: 'Sweet grapes',
        image: 'grapes.png',
        reviews: [],
        inStock: true
    },
    {
        name: 'Pear',
        price: 1.49,
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: [],
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderProductsPage = (cartContext = mockCartContext) => {
    return render(
        <BrowserRouter>
            <CartContext.Provider value={cartContext}>
                <ProductsPage />
            </CartContext.Provider>
        </BrowserRouter>
    );
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        // Mock fetch to never resolve
        vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
        renderProductsPage();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('renders products after loading', async () => {
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('$1.99')).toBeInTheDocument();
        expect(screen.getByText('Fresh apple')).toBeInTheDocument();
    });

    it('renders Add to Cart button for in-stock products', async () => {
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });

        const addButtons = screen.getAllByText('Add to Cart');
        expect(addButtons.length).toBeGreaterThan(0);
    });

    it('renders Out of Stock for out-of-stock products', async () => {
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Orange')).toBeInTheDocument();
        });

        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('calls addToCart when Add to Cart is clicked', async () => {
        const user = userEvent.setup();
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getAllByText('Add to Cart').length).toBeGreaterThan(0);
        });

        await user.click(screen.getAllByText('Add to Cart')[0]);
        expect(mockCartContext.addToCart).toHaveBeenCalled();
    });

    it('handles fetch error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            return Promise.resolve({
                ok: false,
                status: 404
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('opens review modal when product image is clicked', async () => {
        const user = userEvent.setup();
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByAltText('Apple')).toBeInTheDocument();
        });

        await user.click(screen.getByAltText('Apple'));
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
    });

    it('closes review modal when close is clicked', async () => {
        const user = userEvent.setup();
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByAltText('Apple')).toBeInTheDocument();
        });

        await user.click(screen.getByAltText('Apple'));
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();

        await user.click(screen.getByText('Close'));
        expect(screen.queryByText('Reviews for Apple')).not.toBeInTheDocument();
    });

    it('submits a review and updates product', async () => {
        const user = userEvent.setup();
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByAltText('Apple')).toBeInTheDocument();
        });

        await user.click(screen.getByAltText('Apple'));
        
        // Fill in and submit a review using the real ReviewModal
        await user.type(screen.getByPlaceholderText('Your name'), 'Tester');
        await user.type(screen.getByPlaceholderText('Your review'), 'Great!');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Modal should still be open with the updated product
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
    });

    it('throws error when used outside CartProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            render(
                <BrowserRouter>
                    <ProductsPage />
                </BrowserRouter>
            );
        }).toThrow('CartContext must be used within a CartProvider');
        consoleSpy.mockRestore();
    });

    it('disables Out of Stock button', async () => {
        let callIndex = 0;
        vi.spyOn(global, 'fetch').mockImplementation(() => {
            const product = mockProducts[callIndex] || mockProducts[0];
            callIndex++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(product)
            } as Response);
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        });

        expect(screen.getByText('Out of Stock')).toBeDisabled();
    });
});
