import type { TransactionType } from '@/types/transaction';
import { Suspense } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import transactionsReducer from '@/features/budget-tracker/transactionsSlice';
import authReducer from '@/features/auth/authSlice';
import Transactions from '@/pages/Transactions/Transactions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTransaction } from '@/api/transactions';
import type { Mock } from 'vitest';

vi.mock('@/api/transactions', () => ({
	createTransaction: vi.fn()
}));

beforeEach(() => {
	vi.clearAllMocks();
	(createTransaction as Mock).mockReset(); // reset the mock before each test
});

const store = (preloadedState = {}) => {
	return configureStore({
		reducer: {
			auth: authReducer,
			transactions: transactionsReducer
		},
		preloadedState
	});
};

const newTransaction: TransactionType = {
	_id: 'txn1',
	amount: 100,
	type: 'Income',
	category: 'Salary',
	dateTime: new Date().toISOString(),
	userId: 'user1'
};

describe('Create transaction integration', () => {

	it('should create a transaction via UI and update the store', async () => {

		const queryClient = new QueryClient(); // Define inside the test to avoid persisting cached data

		(createTransaction as Mock).mockResolvedValueOnce(newTransaction);

		// Dispatch the thunk
		const testStore = store({
			auth: {
				user: { _id: 'user1', email: 'test@test.com' }
			},
			transactions: {
				transactionsList: [newTransaction],
				transactionCount: 1,
				totalAmount: 100,
				sortOrder: 'desc',
				create: {
					loading: false,
					error: null
				},
				update: {
					loading: false,
					error: null
				},
				delete: {
					loading: false,
					error: null
				}
			}
		});

		render(
			<Provider store={testStore}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<Transactions />
					</BrowserRouter>
				</QueryClientProvider>
			</Provider>
		);

		// Click on "+ Add transaction" button to open the popup
		fireEvent.click(screen.getByText('+ Add transaction'));

		const heading = await screen.findByRole('heading', { name: /add transaction/i });
		expect(heading).toBeInTheDocument();

		// Interact with the form
		// Wait for the form to appear
		await waitFor(() => {
			expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument();
		});

		const amountInput = await screen.findByPlaceholderText(/Amount/i);

		// Fill the form
		fireEvent.change(amountInput, { target: { value: '100' } });
		fireEvent.change(screen.getByPlaceholderText(/category/i), { target: { value: 'Salary' } });
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Income' } });
		fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));


		await waitFor(() => {
			const state = testStore.getState().transactions;

			expect(state.create.loading).toBe(false);
			expect(state.create.error).toBeNull();
			expect(state.transactionCount).toBe(1);
			expect(state.totalAmount).toBe(newTransaction.amount);
			expect(state.transactionsList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						amount: 100,
						category: 'Salary',
						type: 'Income',
						userId: 'user1'
					}),
				])
			);
		});
	});

	it('should show an error when transaction creation fails via UI', async () => {

		const queryClient = new QueryClient(); // Define inside the test to avoid persisting cached data

		const error = new Error('Request failed') as any;
		error.response = { data: { error: 'Failed to create transaction' } };
		(createTransaction as Mock).mockRejectedValueOnce(error);

		const testStore = store({
			auth: {
				user: { _id: 'user1', email: 'test@test.com' }
			},
			transactions: {
				transactionsList: [],
				transactionCount: 0,
				totalAmount: 0,
				sortOrder: 'desc',
				create: {
					loading: false,
					error: null
				},
				update: {
					loading: false,
					error: null
				},
				delete: {
					loading: false,
					error: null
				}
			}
		});

		render(
			<Provider store={testStore}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<Suspense fallback={<div>Loading...</div>}>
							<Transactions />
						</Suspense>
					</BrowserRouter>
				</QueryClientProvider>
			</Provider>
		);

		fireEvent.click(screen.getByText('+ Add transaction'));

		// Wait for popup to render
		await waitFor(() => screen.getByRole('heading', { name: /add transaction/i }));

		screen.debug(document.body);
		// Wait for inputs
		const amountInput = await screen.findByPlaceholderText(/Amount/i);
		fireEvent.change(amountInput, { target: { value: '100' } });
		fireEvent.change(screen.getByPlaceholderText(/category/i), { target: { value: 'Salary' } });
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Income' } });
		fireEvent.click(screen.getByTestId('transaction-form-submit'));

		await waitFor(() => {
			const errorText = testStore.getState().transactions.create.error;
			expect(errorText).toBe('Failed to create transaction');

			const errorBox = screen.getByTestId('transaction-error');
			expect(errorBox).toHaveTextContent(/failed to create transaction/i);
		});
	});


});