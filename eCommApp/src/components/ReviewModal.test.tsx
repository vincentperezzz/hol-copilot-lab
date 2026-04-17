import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const mockProduct: Product = {
    id: '1',
    name: 'Apple',
    price: 1.99,
    description: 'Fresh apple',
    image: 'apple.png',
    reviews: [
        { author: 'John', comment: 'Great product!', date: '2025-01-15T10:00:00Z' },
        { author: 'Jane', comment: 'Very fresh', date: '2025-01-10T10:00:00Z' }
    ],
    inStock: true
};

const mockProductNoReviews: Product = {
    id: '2',
    name: 'Orange',
    price: 2.49,
    reviews: [],
    inStock: true
};

describe('ReviewModal', () => {
    it('returns null when product is null', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        expect(container.innerHTML).toBe('');
    });

    it('renders product name in heading', () => {
        render(
            <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
    });

    it('renders existing reviews', () => {
        render(
            <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    it('shows "No reviews yet." when product has no reviews', () => {
        render(
            <ReviewModal product={mockProductNoReviews} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders the review form', () => {
        render(
            <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        expect(screen.getByText('Leave a Review')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('calls onClose when Close button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <ReviewModal product={mockProduct} onClose={onClose} onSubmit={vi.fn()} />
        );
        await user.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <ReviewModal product={mockProduct} onClose={onClose} onSubmit={vi.fn()} />
        );
        // Click the backdrop (the outer div with modal-backdrop class)
        const backdrop = screen.getByText('Reviews for Apple').closest('.modal-content')!.parentElement!;
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalled();
    });

    it('does not call onClose when modal content is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <ReviewModal product={mockProduct} onClose={onClose} onSubmit={vi.fn()} />
        );
        // Click on the modal content area (not the backdrop)
        await user.click(screen.getByText('Leave a Review'));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onSubmit with review data when form is submitted', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(
            <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={onSubmit} />
        );
        await user.type(screen.getByPlaceholderText('Your name'), 'Tester');
        await user.type(screen.getByPlaceholderText('Your review'), 'Amazing product');
        await user.click(screen.getByText('Submit'));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                author: 'Tester',
                comment: 'Amazing product',
                date: expect.any(String)
            })
        );
    });

    it('resets form after submission', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        const nameInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');

        await user.type(nameInput, 'Tester');
        await user.type(commentInput, 'Amazing product');
        await user.click(screen.getByText('Submit'));

        expect(nameInput).toHaveValue('');
        expect(commentInput).toHaveValue('');
    });
});
