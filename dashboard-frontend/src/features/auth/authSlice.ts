//slice, actions, reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, MinimalUser, AuthState } from '@/types/user';
import { RootState } from '@/app/store';

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

const addUserSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{user: MinimalUser ; token: string}>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        }
    },
});

export const { login, logout, setUser } = addUserSlice.actions;
export default addUserSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
