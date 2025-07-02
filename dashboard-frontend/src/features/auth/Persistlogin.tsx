import { useState, useEffect, FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { login, logout } from '@/features/auth/authSlice';

const PersistLogin: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const parsePersistedUser = () => {
    try {
      const rawAuth = localStorage.getItem('auth');
      if (!rawAuth) return null;

      const parsed = JSON.parse(rawAuth);
      return parsed?.user ?? null;
    } catch (e) {
      console.error('Failed to parse auth data from localStorage:', e);
      return null;
    }
  };

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const res = await fetch('http://localhost:4000/auth/refresh', {
          method: 'POST',
          credentials: 'include', // sends the refresh token cookie
        });

        if (!res.ok) throw new Error('Refresh failed');

        const data = await res.json();
        const persistedUser = parsePersistedUser();
        if (!persistedUser) throw new Error('No auth data in localStorage');

        dispatch(login({ user: persistedUser, token: data.accessToken }));
      } catch (err) {
        console.error('Refresh error:', err);
        dispatch(logout());        
      } finally {
        setIsLoading(false);
      }
    };

    const persistedUser = parsePersistedUser();

    if (!accessToken && persistedUser) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <Outlet />;
};

export default PersistLogin;
