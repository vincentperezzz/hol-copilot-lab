import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';
import { Product } from '../types';

const mockProduct: Product = {
    id: '1',
    name: 'Apple',
    price: 1.99,
    reviews: [],
    inStock: true
};

const mockProduct2: Product = {
    id: '2',
    name: 'Orange',
    price: 2.49,
    reviews: [],
    inStock: true
};

// Test component that exposes cart context for testing
const TestConsumer = () => {
    const context = useContext(CartContext);
    if (!context) return <div>No context</div>;
    return (
        <div>
            <span data-testid="item-count">{context.cartItems.length}</span>
            <span data-testid="cart-items">{JSON.stringify(context.cartItems)}</span>
            <button data-testid="add-apple" onClick={() => context.addToCart(mockProduct)}>Add Apple</button>
            <button data-testid="add-orange" onClick={() => context.addToCart(mockProduct2)}>Add Orange</button>
            <button data-testid="clear" onClick={() => context.clearCart()}>Clear</button>
        </div>
    );
};

describe('CartContext', () => {
    it('provides initial empty cart', () => {
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    });

    it('adds a product to cart', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByTestId('add-apple'));
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
        const items = JSON.parse(screen.getByTestId('cart-items').textContent!);
        expect(items[0].name).toBe('Apple');
        expect(items[0].quantity).toBe(1);
    });

    it('increments quantity when adding same product twice', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByTestId('add-apple'));
        await user.click(screen.getByTestId('add-apple'));
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
        const items = JSON.parse(screen.getByTestId('cart-items').textContent!);
        expect(items[0].quantity).toBe(2);
    });

    it('adds different products as separate items', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByTestId('add-apple'));
        await user.click(screen.getByTestId('add-orange'));
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
    });

    it('clears all items from cart', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByTestId('add-apple'));
        await user.click(screen.getByTestId('add-orange'));
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');

        await user.click(screen.getByTestId('clear'));
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    });

    it('only increments quantity of matching product', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByTestId('add-apple'));
        await user.click(screen.getByTestId('add-orange'));
        await user.click(screen.getByTestId('add-apple'));

        const items = JSON.parse(screen.getByTestId('cart-items').textContent!);
        expect(items).toHaveLength(2);
        const apple = items.find((i: any) => i.name === 'Apple');
        const orange = items.find((i: any) => i.name === 'Orange');
        expect(apple.quantity).toBe(2);
        expect(orange.quantity).toBe(1);
    });

    it('returns undefined when used outside provider', () => {
        const TestOutsideProvider = () => {
            const context = useContext(CartContext);
            return <div data-testid="context-value">{context === undefined ? 'undefined' : 'defined'}</div>;
        };
        render(<TestOutsideProvider />);
        expect(screen.getByTestId('context-value')).toHaveTextContent('undefined');
    });
});
