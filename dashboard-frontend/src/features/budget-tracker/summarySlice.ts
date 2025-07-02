//slice, actions, reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SummaryType } from '@/types/summary';
import { RootState } from '@/app/store';

interface SummaryState {
    totalAmount: number;
    transactionCount: number;
}

const initialState: SummaryState = {
    totalAmount: 0,
    transactionCount: 0,
};

const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {
        // Set full summary (totalAmount + transactionCount)
        setTotalAmount(state, action: PayloadAction<SummaryType>) {
            state.totalAmount = action.payload.totalAmount;
        },

        // Clear summary back to null
        clearTotalAmount(state) {
            state.totalAmount = 0;
        },

        // Update only totalAmount
        updateTotalAmount(state, action: PayloadAction<number>) {
            state.totalAmount = action.payload
        },

        // Update only transactionCount
        updateTransactionCount(state, action: PayloadAction<number>) {
            state.transactionCount = action.payload;
        },
    },
});

export const { setTotalAmount, clearTotalAmount, updateTotalAmount, updateTransactionCount } = summarySlice.actions;
export default summarySlice.reducer;

export const selectTotalAmount = (state: RootState) => state.summary.totalAmount;
export const selectTransactionCount = (state: RootState) => state.summary.transactionCount;
