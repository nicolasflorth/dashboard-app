// src/pages/HomePage.tsx
import { useState, useEffect  } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import styles from './Dashboard.module.scss';
import { fetchTransactions, selectTotalExpenses, selectTotalIncomes } from '@/features/budget-tracker/transactionsSlice';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Summary from '@/features/budget-tracker/components/Summary/Summary';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { PieChart } from '@mui/x-charts/PieChart';

function DashboardPage() {
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const userId = useAppSelector((state) => state.auth.user?._id) as number | undefined;
  const totalExpenses = useSelector<RootState, number>(selectTotalExpenses);
  const totalIncomes = useSelector<RootState, number>(selectTotalIncomes);
  const location = useLocation();
  const isRootDashboard = location.pathname === '/dashboard';

  const handleTransactionId = (id: string) => {
    setTransactionId(id);
    setOpen(true);
  }
  
  // to can get transactions summary on Dashboard page load and not only on Transactions page load, do the API call here
  useEffect(() => {
      if (userId !== undefined) {
          dispatch(fetchTransactions(userId.toString())); // pass the logged-in user's ID
      }
  }, [dispatch, userId]);

  return isRootDashboard ? (
    <main className="">

      <div className={styles.app}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <Outlet />
          <div className={styles.widgets}>
            <div className={styles.widget}>
              <Link to="transactions">
                <h2>Transactions</h2>
                <Summary variant="dashboard"/>
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
