import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import Logoutbutton from './LogoutButton'
import { store } from '@/app/store'
import { login } from '@/features/auth/authSlice'
import userEvent from '@testing-library/user-event';


describe('LogoutButton', () => {
    it('dispatches logout action when clicked', async () => {
        // Arrange: Loggin first to simulate loggin-in state
        store.dispatch(
            login({
                user: {
                    _id: '1',
                    email: 'test@test.com',
                    roles: ['admin'],
                },
                token: 'fake-token',
            })
        );

        render(
            <Provider store={store}>
                <Logoutbutton />
            </Provider>
        )

        const button = screen.getByTestId('logout-button');

        // Click Logout
        await userEvent.click(button);
        await waitFor(() => {
            // Assets: user should be logged out
            const state = store.getState().auth;
            expect(state.isAuthenticated).toBe(false);
            expect(state.user).toBe(null);
        });
    })
})