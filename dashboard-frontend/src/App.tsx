
//import Popup from '@/components/Popup';
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage/HomePage';
import LoginPage from '@/features/auth/LoginPage';
const DashboardPage = lazy(() => import('@/pages/DashboardPage/DashboardPage'));
const Transactions = lazy(() => import('@/pages/Transactions/Transactions'));
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import PersistLogin from '@/features/auth/Persistlogin';
import ProtectedRoute from '@/features/auth/RequireAuth';
import { useAppSelector } from '@/app/hooks';
import Header from '@/shared/components/Header/Header'
import Footer from '@/shared/components/Footer/Footer'
import { renderLoader } from '@/shared/components/Loader/Loader';

// Define ROLES constant
const ROLES = {
	User: 'user',
	Admin: 'admin'
};

function App() {

	const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
	return (
		<>
			<Header />
			<Routes>
				{/* public routes */}
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />

				<Route element={<PersistLogin />}>
					{/* protected routes - Require authentication + role */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute allowedRoles={[ROLES.Admin]}>
								<Suspense fallback={renderLoader()}>
									<DashboardPage />
								</Suspense>
							</ProtectedRoute>
						}
					>
						<Route path="transactions" element={
							<ProtectedRoute allowedRoles={[ROLES.Admin]}>
								<Suspense fallback={renderLoader()}>
									<Transactions />
								</Suspense>
							</ProtectedRoute>
						} />
					</Route>
				</Route>

				{/* catch all */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
			<Footer />
		</>
	);
}

export default App;
