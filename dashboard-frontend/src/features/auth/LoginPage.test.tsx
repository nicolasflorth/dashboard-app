import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/app/store';
import { vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { AppStore } from '@/app/store';
import authReducer from '@/features/auth/authSlice';
import transactionsReducer from '@/features/budget-tracker/transactionsSlice';
import categoriesFiltersReducer from '@/features/budget-tracker/categoriesFiltersSlice';
import summaryReducer from '@/features/budget-tracker/summarySlice';
import userEvent from '@testing-library/user-event';
import { api } from '@/api/users';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const createTestStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
			transactions: transactionsReducer,
			categoriesFilters: categoriesFiltersReducer,
			summary: summaryReducer,
		},
	});
};

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('@/api/apiFacade', () => ({
	api: {
		login: vi.fn(),
	},
}));

describe('LoginPage', () => {
	beforeEach(() => {
		vi.resetAllMocks();         // resets mocks
		global.fetch = vi.fn();     // fresh mock each test
		mockNavigate.mockReset();   // clear navigate calls
	});

	const renderPage = (customStore: AppStore) => {
		render(
			<Provider store={customStore}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<LoginPage />
					</BrowserRouter>
				</QueryClientProvider>
			</Provider>
		);
	};

	it('renders the form fields', () => {
		const testStore = createTestStore();
		renderPage(testStore);
		expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
	});

	it('shows validation errors on empty submit', async () => {
		const testStore = createTestStore();
		renderPage(testStore);

		fireEvent.click(screen.getByText(/Submit/i));

		await waitFor(() => {
			expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
			expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
		});
	});

	it('shows validation errors on wrong data submit', async () => {
		const testStore = createTestStore();
		renderPage(testStore);

		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: 'test' },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: '32' },
		});

		fireEvent.click(screen.getByText(/Submit/i));

		await waitFor(() => {
			expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
			expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();
		});
	});

	it('submits successfully and navigates on valid input', async () => {
		(api.login as ReturnType<typeof vi.fn>).mockResolvedValue({
			id: 1,
			email: 'test@test.com',
			roles: ['user'],
			accessToken: 'fake-token',
		});

		const testStore = createTestStore();
		renderPage(testStore);

		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: 'test@test.com' },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: 'emilyspass' },
		});

		fireEvent.click(screen.getByText(/submit/i));

		await waitFor(() => {
			expect(api.login).toHaveBeenCalled();

			const state = testStore.getState().auth;
			expect(state.isAuthenticated).toBe(true);
			expect(state.user?.email).toBe('test@test.com');
			expect(state.accessToken).toBe('fake-token');

			expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
		});
	});
	it('shows error and does not authenticate on invalid credentials', async () => {
		(api.login as ReturnType<typeof vi.fn>).mockRejectedValue({
			response: {
				data: {
					message: 'Invalid credentials',
				},
			},
		});


		const testStore = createTestStore();
		renderPage(testStore);

		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: 'wrong@test.com' },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: 'wrongpass' },
		});

		fireEvent.click(screen.getByText(/submit/i));

		await waitFor(() => {
			// Shows the error message from server
			expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();

			// Does not navigate
			expect(mockNavigate).not.toHaveBeenCalled();

			// Does not update auth state
			const state = testStore.getState().auth;
			expect(state.isAuthenticated).toBe(false);
			expect(state.user).toBeNull();
			expect(state.accessToken).toBeNull();
		});
	});
});
