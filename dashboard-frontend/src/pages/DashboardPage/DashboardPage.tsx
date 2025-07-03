import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import styles from './Dashboard.module.scss';
import { selectTotalExpenses, selectTotalIncomes } from '@/features/budget-tracker/transactionsSlice';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Summary from '@/features/budget-tracker/components/Summary/Summary';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useFetchTransactions } from '@/hooks/useFetchTransactions';

function DashboardPage() {
	const totalExpenses = useSelector<RootState, number>(selectTotalExpenses);
	const totalIncomes = useSelector<RootState, number>(selectTotalIncomes);
	const location = useLocation();
	const isRootDashboard = location.pathname === '/dashboard';
	const sortOrder = useAppSelector((state: RootState) => state.transactions.sortOrder);
	// to can get transactions summary on Dashboard page load and not only on Transactions page load, do the API call here
	useFetchTransactions(sortOrder); // defaults to 'desc'

	return isRootDashboard ? (
		<main className="">

			<div className={styles.app}>
				<h1 className={styles.pageTitle}>Dashboard</h1>
				<Outlet />
				<div className={styles.widgets}>
					<div className={styles.widget}>
						<Link to="transactions">
							<h2>Transactions</h2>
							<Summary variant="dashboard" />
							<div className={styles.chart}>
								<PieChart
									series={[
										{
											data: [
												{ id: 0, value: totalExpenses, label: 'Expenses' },
												{ id: 1, value: totalIncomes, label: 'Incomes' }
											],
										},
									]}
								/>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</main>
	) : <Outlet />;
}

export default DashboardPage;
