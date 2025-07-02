import { configureStore } from '@reduxjs/toolkit';
import addAuthReducer from '@/features/auth/authSlice';
import transactionsReducer from '@/features/budget-tracker/transactionsSlice';
import categoriesFiltersReducer from '@/features/budget-tracker/categoriesFiltersSlice';
import summaryReducer from '@/features/budget-tracker/summarySlice';

const persistedAuth = localStorage.getItem('auth');

const preloadedState = persistedAuth ? { auth: JSON.parse(persistedAuth) } : undefined;

export const store = configureStore({
    reducer: {
        auth: addAuthReducer,
        transactions: transactionsReducer,
        categoriesFilters: categoriesFiltersReducer,
        summary: summaryReducer
    },
    preloadedState
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Save to localStorage
store.subscribe(() => {
    const { auth } = store.getState();
    localStorage.setItem('auth', JSON.stringify(auth));
});

