import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './RegisterPage';
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
import type { Mock } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

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

vi.mock('@/api/users', () => ({
    api: {
        register: vi.fn(),
    },
}));

describe('RegisterPage', () => {
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
						<I18nextProvider i18n={i18n}>
						    <RegisterPage />
                        </I18nextProvider>
					</BrowserRouter>
				</QueryClientProvider>
			</Provider>
		);
	};
    
    it('renders the form fields', () => {
        const testStore = createTestStore();
        renderPage(testStore);
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    });

});
