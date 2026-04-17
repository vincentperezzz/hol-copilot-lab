import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('renders checkout confirmation message', () => {
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />);
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('renders Continue Checkout button', () => {
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />);
        expect(screen.getByText('Continue Checkout')).toBeInTheDocument();
    });

    it('renders Return to cart button', () => {
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />);
        expect(screen.getByText('Return to cart')).toBeInTheDocument();
    });

    it('calls onConfirm when Continue Checkout is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={vi.fn()} />);
        await user.click(screen.getByText('Continue Checkout'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Return to cart is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={onCancel} />);
        await user.click(screen.getByText('Return to cart'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
