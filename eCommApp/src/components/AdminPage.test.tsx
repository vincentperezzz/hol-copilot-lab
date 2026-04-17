import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

const renderAdminPage = () => {
    return render(
        <BrowserRouter>
            <AdminPage />
        </BrowserRouter>
    );
};

describe('AdminPage', () => {
    it('renders admin portal heading', () => {
        renderAdminPage();
        expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
    });

    it('renders Header and Footer', () => {
        renderAdminPage();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('renders sale percent input with initial value of 0', () => {
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);
        expect(input).toHaveValue('0');
    });

    it('shows "No sale active." initially', () => {
        renderAdminPage();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('sets sale percentage on valid input', async () => {
        const user = userEvent.setup();
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '25');
        await user.click(screen.getByText('Submit'));
        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows error on invalid (non-numeric) input', async () => {
        const user = userEvent.setup();
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, 'abc');
        await user.click(screen.getByText('Submit'));
        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
    });

    it('resets sale on "End Sale" click', async () => {
        const user = userEvent.setup();
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);
        // First set a sale
        await user.clear(input);
        await user.type(input, '50');
        await user.click(screen.getByText('Submit'));
        expect(screen.getByText('All products are 50% off!')).toBeInTheDocument();

        // Then end it
        await user.click(screen.getByText('End Sale'));
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByLabelText(/Set Sale Percent/)).toHaveValue('0');
    });

    it('renders "Back to Storefront" link', () => {
        renderAdminPage();
        const backLink = screen.getByText('Back to Storefront');
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('updates input value when typing', async () => {
        const user = userEvent.setup();
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '15');
        expect(input).toHaveValue('15');
    });

    it('handles zero as valid sale percent', async () => {
        const user = userEvent.setup();
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '0');
        await user.click(screen.getByText('Submit'));
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });
});
