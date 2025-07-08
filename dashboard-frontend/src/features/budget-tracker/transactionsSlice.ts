//slice, actions, reducer
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { TransactionType } from '@/types/transaction';
import { RootState } from '@/app/store';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '@/api/transactions';
import { createSelector } from '@reduxjs/toolkit';

export const fetchTransactionsAsync = createAsyncThunk(
    'transactions/fetchAll',
    async (userId: string) => {
        const response = await fetchTransactions(userId);
        console.log("Fetched transactions:", response);
        return response;
    }
);

export const createTransactionAsync = createAsyncThunk<
    TransactionType,
    { userId: string; data: Partial<TransactionType> },
    { rejectValue: string }
>(
    'transactions/create',
    async ({ userId, data }, { rejectWithValue }) => {
        try {
            const response = await createTransaction(userId, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || 'Unknown error');

        }
    }
);


export const updateTransactionAsync = createAsyncThunk(
    'transactions/update',
    async (
        { userId, transactionId, data }: { userId: string; transactionId: string; data: Partial<TransactionType> },
        { rejectWithValue }
    ) => {
        try {
            const response = await updateTransaction(userId, transactionId, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || 'Update failed');
        }
    }
);

export const deleteTransactionAsync = createAsyncThunk(
    'transactions/delete',
    async (
        { userId, transactionId }: { userId: string; transactionId: string },
        { rejectWithValue }
    ) => {
        try {
            await deleteTransaction(userId, transactionId); // your API function
            return transactionId;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || 'Update failed');
        }
    }
);

const sortTransactions = (transactions: TransactionType[], order: 'asc' | 'desc') => {
    return transactions.slice().sort((a, b) => {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
};

type TransactionsState = {
    transactionsList: TransactionType[];
    sortOrder: 'asc' | 'desc';
    fetch: {
        loading: boolean;
        error: string | null;
    };
    create: {
        loading: boolean;
        error: string | null;
    };
    update: {
        loading: boolean;
        error: string | null;
    };
    delete: {
        loading: boolean;
        error: string | null;
    };
    totalAmount: number;
    transactionCount: number;
};

const initialState: TransactionsState = {
    transactionsList: [],
    sortOrder: 'desc',
    fetch: { loading: false, error: null },
    update: { loading: false, error: null },
    create: { loading: false, error: null },
    delete: { loading: false, error: null },
    totalAmount: 0,
    transactionCount: 0,
};


const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        sortTransactionsByDateTime: (state, action: PayloadAction<'asc' | 'desc'>) => {
            state.sortOrder = action.payload;
            state.transactionsList = sortTransactions([...state.transactionsList], state.sortOrder);
        },
        clearCreateError(state) {
            state.create.error = null;
        },
        clearUpdateError(state) {
            state.update.error = null;
        },
        clearDeleteError(state) {
            state.delete.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Transactions
            .addCase(fetchTransactionsAsync.pending, (state) => {
                state.fetch.loading = true;
                state.fetch.error = null;
            })
            .addCase(fetchTransactionsAsync.fulfilled, (state, action: PayloadAction<TransactionType[]>) => {
                state.fetch.loading = false;
                state.transactionsList = sortTransactions([...action.payload], state.sortOrder);
                state.transactionCount = action.payload.length;
                state.totalAmount = action.payload.reduce((acc, txn) =>
                    txn.type === 'Income' ? acc + txn.amount : acc - txn.amount, 0
                );
            })
            .addCase(fetchTransactionsAsync.rejected, (state, action) => {
                state.fetch.loading = false;
                state.fetch.error = action.error.message || 'Failed to load transactions';
            })

            // Create Transaction
            .addCase(createTransactionAsync.pending, (state) => {
                state.create = { loading: true, error: null };
            })
            .addCase(createTransactionAsync.fulfilled, (state, action: PayloadAction<TransactionType>) => {
                state.create.loading = false;
                state.transactionsList.push(action.payload);
                state.transactionCount += 1;
                state.totalAmount += action.payload.type === 'Income'
                    ? action.payload.amount
                    : -action.payload.amount;

                // Re-sort after adding new transaction
                state.transactionsList = sortTransactions([...state.transactionsList], state.sortOrder);
            })
            .addCase(createTransactionAsync.rejected, (state, action) => {
                state.create.loading = false;
                state.create.error = (action.payload as string) || 'Unknown error';
            })


            // Update Transaction
            .addCase(updateTransactionAsync.pending, (state) => {
                state.update.loading = true;
                state.update.error = null;
            })
            .addCase(updateTransactionAsync.fulfilled, (state, action: PayloadAction<TransactionType>) => {
                state.update.loading = false;
                const index = state.transactionsList.findIndex(
                    (txn) => txn._id === action.payload._id
                );
                if (index !== -1) {
                    state.transactionsList[index] = action.payload;
                }
                state.totalAmount = state.transactionsList.reduce((acc, txn) =>
                    txn.type === 'Income' ? acc + txn.amount : acc - txn.amount, 0
                );
            })
            .addCase(updateTransactionAsync.rejected, (state, action) => {
                state.update.loading = false;
                state.update.error = (action.payload as string) || 'Unknown error';
            })

            // Update Transaction
            .addCase(deleteTransactionAsync.pending, (state) => {
                state.delete.loading = true;
                state.delete.error = null;
            })
            .addCase(deleteTransactionAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.delete.loading = false;
                state.transactionsList = state.transactionsList.filter(
                    (txn) => txn._id !== action.payload
                );
                state.transactionCount = state.transactionsList.length;
                state.totalAmount = state.transactionsList.reduce((acc, txn) =>
                    txn.type === 'Income' ? acc + txn.amount : acc - txn.amount, 0
                );
            })
            .addCase(deleteTransactionAsync.rejected, (state, action) => {
                state.delete.loading = false;
                state.delete.error = (action.payload as string) || 'Failed to delete transaction';
            });


    }
});

export const {
    sortTransactionsByDateTime,
    clearCreateError,
    clearUpdateError,
    clearDeleteError 
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

export const selectTransactions = (state: RootState) => state.transactions.transactionsList;
export const selectTotalAmount = (state: RootState) => state.transactions.totalAmount;
export const selectTransactionCount = (state: RootState) => state.transactions.transactionCount;

export const selectTotalExpenses = createSelector(
    (state: RootState) => state.transactions.transactionsList,
    (transactions) =>
        transactions
            .filter((txn) => txn.type === 'Expense')
            .reduce((sum, txn) => sum + txn.amount, 0)
);
export const selectTotalIncomes = createSelector(
    (state: RootState) => state.transactions.transactionsList,
    (transactions) =>
        transactions
            .filter((txn) => txn.type === 'Income')
            .reduce((sum, txn) => sum + txn.amount, 0)
);