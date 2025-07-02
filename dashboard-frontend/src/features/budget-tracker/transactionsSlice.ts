//slice, actions, reducer
import { createSlice, PayloadAction, createAsyncThunk  } from '@reduxjs/toolkit';
import type { TransactionType } from '@/types/transaction';
import { RootState } from '@/app/store';
import { getTransactions } from '@/api/transactions';
import { createSelector } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (userId: string) => {
    const response = await getTransactions(userId);
    return response;
  }
);

type TransactionsState = {
  transactionsList: TransactionType[];
  loading: boolean;
  error: string | null;
  totalAmount: number;
  transactionCount: number;
};

const initialState: TransactionsState = {
  transactionsList: [],
  loading: false,
  error: null,
  totalAmount: 0,
  transactionCount: 0,
};


const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<TransactionType>) => {
            state.transactionsList.push(action.payload);
        },
        updateTransaction: (state, action: PayloadAction<TransactionType>) => {
            const index = state.transactionsList.findIndex(transaction => transaction._id === action.payload._id);
            if (index !== -1) {
                state.transactionsList[index] = action.payload;
            }
            console.log("Old transactions", state.transactionsList);
            console.log("Updated transaction:", action.payload);
            console.log("Old transaction:", state.transactionsList[index]);
        },
        removeTransaction: (state, action: PayloadAction<string>) => {
            state.transactionsList = state.transactionsList.filter(
                (transaction) => transaction._id !== action.payload
            );
        },
        sortTransactionsByDateTime: (state, action: PayloadAction<'asc' | 'desc'>) => {
            state.transactionsList.sort((a, b) => {
                const dateTimeA = new Date(a.dateTime).getTime();
                const dateTimeB = new Date(b.dateTime).getTime();
                return action.payload === 'asc' ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<TransactionType[]>) => {
                state.loading = false;
                state.transactionsList = action.payload;
                state.transactionCount = action.payload.length;
                state.totalAmount = action.payload.reduce((acc, txn) => 
                    txn.type === 'Income' ? acc + txn.amount : acc - txn.amount, 0
                );
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load transactions';
            });
    }
});

export const { addTransaction, updateTransaction, removeTransaction, sortTransactionsByDateTime } = transactionsSlice.actions;
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

