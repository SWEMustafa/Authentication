import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import Login from '../components/Login';
import Signup from '../components/Signup';
import ForgotPassword from '../components/ForgotPassword';
import UpdateProfile from '../components/UpdateProfile';
import PrivateRoute from '../components/PrivateRoute';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));
import { useAuth } from '../contexts/AuthContext';

describe('Authentication Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login', () => {
    test('renders inputs and button', () => {
      useAuth.mockReturnValue({ login: vi.fn() });
      const { container } = render(<Router><Login /></Router>);

      expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
      expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test('shows login error', async () => {
      const login = vi.fn().mockRejectedValue({ code: 'auth/wrong-password' });
      useAuth.mockReturnValue({ login });

      const { container } = render(<Router><Login /></Router>);
      fireEvent.change(container.querySelector('input[type="email"]'), { target: { value: 'user@example.com' } });
      fireEvent.change(container.querySelector('input[type="password"]'), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/wrong password/i)).toBeInTheDocument();
      });
    });
  });

  describe('Signup', () => {
    test('shows error when passwords do not match', async () => {
      useAuth.mockReturnValue({ signup: vi.fn() });
      const { container } = render(<Router><Signup /></Router>);
    
      const email = container.querySelector('input[type="email"]');
      const passwords = container.querySelectorAll('input[type="password"]');
    
      fireEvent.change(email, { target: { value: 'test@example.com' } });
      fireEvent.change(passwords[0], { target: { value: 'Password123!' } }); // password
      fireEvent.change(passwords[1], { target: { value: 'Mismatch123!' } }); // confirmation
    
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
      await waitFor(() => {
        // Match with a function to avoid issues with split elements
        const errorMessage = screen.getByText((content) =>
          content.includes('Passwords do not match')
        );
        expect(errorMessage).toBeInTheDocument();
      });
    });

    test('calls signup with rememberMe', async () => {
      const signup = vi.fn().mockResolvedValue();
      useAuth.mockReturnValue({ signup });

      const { container } = render(<Router><Signup /></Router>);
      fireEvent.change(container.querySelector('input[type="email"]'), { target: { value: 'test@example.com' } });
      fireEvent.change(container.querySelectorAll('input[type="password"]')[0], { target: { value: 'Password123!' } });
      fireEvent.change(container.querySelectorAll('input[type="password"]')[1], { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(signup).toHaveBeenCalledWith('test@example.com', 'Password123!', true);
      });
    });
  });

  describe('ForgotPassword', () => {
    test('resets password successfully', async () => {
      const resetPassword = vi.fn().mockResolvedValue();
      useAuth.mockReturnValue({ resetPassword });

      const { container } = render(<Router><ForgotPassword /></Router>);
      fireEvent.change(container.querySelector('input[type="email"]'), { target: { value: 'user@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

      await waitFor(() => {
        expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
      });
    });

    test('shows user not found error', async () => {
      const resetPassword = vi.fn().mockRejectedValue({ code: 'auth/user-not-found' });
      useAuth.mockReturnValue({ resetPassword });

      const { container } = render(<Router><ForgotPassword /></Router>);
      fireEvent.change(container.querySelector('input[type="email"]'), { target: { value: 'unknown@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

      await waitFor(() => {
        expect(screen.getByText(/no user found/i)).toBeInTheDocument();
      });
    });
  });

  describe('UpdateProfile', () => {
    test('shows password mismatch error', () => {
      useAuth.mockReturnValue({
        currentUser: { email: 'test@example.com' },
        updateEmail: vi.fn(),
        updatePassword: vi.fn()
      });
      const { container } = render(<Router><UpdateProfile /></Router>);
      const passwords = container.querySelectorAll('input[type="password"]');
      fireEvent.change(passwords[0], { target: { value: '12345678' } });
      fireEvent.change(passwords[1], { target: { value: 'mismatch' } });
      fireEvent.click(screen.getByRole('button', { name: /update/i }));
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  describe('PrivateRoute', () => {
    test('redirects to login when unauthenticated', () => {
      useAuth.mockReturnValue({ currentUser: null });
      render(
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/private" element={<PrivateRoute><div>Protected</div></PrivateRoute>} />
            <Route path="/login" element={<div>LoginPage</div>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText(/loginpage/i)).toBeInTheDocument();
    });

    test('redirects to verify-email if not verified', () => {
      useAuth.mockReturnValue({ currentUser: { emailVerified: false } });
      render(
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/private" element={<PrivateRoute><div>Protected</div></PrivateRoute>} />
            <Route path="/verify-email" element={<div>VerifyEmailPage</div>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText(/verifyemailpage/i)).toBeInTheDocument();
    });

    test('renders child if email is verified', () => {
      useAuth.mockReturnValue({ currentUser: { emailVerified: true } });
      render(
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/private" element={<PrivateRoute><div>Protected</div></PrivateRoute>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText(/protected/i)).toBeInTheDocument();
    });
  });
});