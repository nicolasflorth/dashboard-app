// __tests__/addTransactionSlice.test.ts
import { describe, it, expect } from 'vitest';
import reducer, { updateTransactionAsync } from '@/features/budget-tracker/transactionsSlice';
import type { TransactionType } from '@/types/transaction';

describe('addTransactionSlice', () => {
	it('should update an existing transaction', () => {
		const initialState = {
			transactionsList: [
				{
					_id: '1',
					amount: 100,
					type: 'Income',
					category: 'Salary',
					dateTime: '2025-01-01T00:00:00.000Z',
				},
				{
					_id: '2',
					amount: 50,
					type: 'Expense',
					category: 'Food',
					dateTime: '2025-01-01T00:00:00.000Z',
				},
			] as TransactionType[],
			loading: false,
			error: null,
			totalAmount: 50,
			transactionCount: 2
		};

		const updatedTransaction: TransactionType = {
			_id: '2',
			amount: 75,
			type: 'Expense',
			category: 'Groceries',
			dateTime: '2025-01-02T00:00:00.000Z',
		};

		const newState = reducer(initialState, updateTransactionAsync(updatedTransaction));

		expect(newState.transactionsList[1]).toEqual(updatedTransaction);
		expect(newState.transactionsList[1].amount).toBe(75);
		expect(newState.transactionsList[1].category).toBe('Groceries');
	});

	it('should not update if transaction ID does not exist', () => {
		const initialState = {
			transactionsList: [
				{
					_id: '1',
					amount: 100,
					type: 'Income',
					category: 'Salary',
					dateTime: '2025-01-01T00:00:00.000Z',
				},
			] as TransactionType[],
			loading: false,
			error: null,
			totalAmount: 100,
			transactionCount: 1
		};

		const nonExistentUpdate: TransactionType = {
			_id: '999',
			amount: 500,
			type: 'Expense',
			category: 'Car Repair',
			dateTime: '2025-01-03T00:00:00.000Z',
		};

		const newState = reducer(initialState, updateTransaction(nonExistentUpdate));

		expect(newState).toEqual(initialState); // No change
	});
});
