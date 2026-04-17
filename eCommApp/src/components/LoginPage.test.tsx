import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLoginPage = () => {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        renderLoginPage();
        expect(screen.getByText('Admin Login', { selector: 'h2' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders Header and Footer', () => {
        renderLoginPage();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('updates username field on input', async () => {
        const user = userEvent.setup();
        renderLoginPage();
        const usernameInput = screen.getByPlaceholderText('Username');
        await user.type(usernameInput, 'admin');
        expect(usernameInput).toHaveValue('admin');
    });

    it('updates password field on input', async () => {
        const user = userEvent.setup();
        renderLoginPage();
        const passwordInput = screen.getByPlaceholderText('Password');
        await user.type(passwordInput, 'secret');
        expect(passwordInput).toHaveValue('secret');
    });

    it('navigates to /admin on successful login', async () => {
        const user = userEvent.setup();
        renderLoginPage();
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByText('Login'));
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('shows error on invalid credentials', async () => {
        const user = userEvent.setup();
        renderLoginPage();
        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByText('Login'));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows error with correct username but wrong password', async () => {
        const user = userEvent.setup();
        renderLoginPage();
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByText('Login'));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('clears error on successful login after failed attempt', async () => {
        const user = userEvent.setup();
        renderLoginPage();
        // First, fail
        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByText('Login'));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();

        // Clear fields and try correct creds
        await user.clear(screen.getByPlaceholderText('Username'));
        await user.clear(screen.getByPlaceholderText('Password'));
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByText('Login'));
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    it('does not show error initially', () => {
        renderLoginPage();
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
});
