import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('formats a whole number price', () => {
        expect(formatPrice(10)).toBe('$10.00');
    });

    it('formats a decimal price', () => {
        expect(formatPrice(29.99)).toBe('$29.99');
    });

    it('formats zero', () => {
        expect(formatPrice(0)).toBe('$0.00');
    });

    it('formats large prices with commas', () => {
        expect(formatPrice(1234.56)).toBe('$1,234.56');
    });

    it('formats negative prices', () => {
        expect(formatPrice(-5.99)).toBe('-$5.99');
    });

    it('rounds to two decimal places', () => {
        expect(formatPrice(1.999)).toBe('$2.00');
    });
});

describe('calculateTotal', () => {
    it('calculates total for multiple items', () => {
        const items = [
            { price: 10, quantity: 2 },
            { price: 5, quantity: 3 },
        ];
        expect(calculateTotal(items)).toBe(35);
    });

    it('returns 0 for empty array', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('handles single item', () => {
        const items = [{ price: 25.50, quantity: 1 }];
        expect(calculateTotal(items)).toBe(25.50);
    });

    it('handles quantity of 0', () => {
        const items = [{ price: 10, quantity: 0 }];
        expect(calculateTotal(items)).toBe(0);
    });

    it('handles large quantities', () => {
        const items = [{ price: 1.5, quantity: 100 }];
        expect(calculateTotal(items)).toBe(150);
    });
});

describe('validateEmail', () => {
    it('validates a correct email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });

    it('validates email with subdomain', () => {
        expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('rejects email without @', () => {
        expect(validateEmail('testexample.com')).toBe(false);
    });

    it('rejects email without domain', () => {
        expect(validateEmail('test@')).toBe(false);
    });

    it('rejects email without TLD', () => {
        expect(validateEmail('test@example')).toBe(false);
    });

    it('rejects empty string', () => {
        expect(validateEmail('')).toBe(false);
    });

    it('rejects email with spaces', () => {
        expect(validateEmail('test @example.com')).toBe(false);
    });

    it('validates email with dots in local part', () => {
        expect(validateEmail('first.last@example.com')).toBe(true);
    });

    it('validates email with plus sign', () => {
        expect(validateEmail('user+tag@example.com')).toBe(true);
    });
});
