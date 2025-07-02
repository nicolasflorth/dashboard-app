
import { useState, useEffect } from 'react';
import type { TransactionType } from '@/types/transaction';
import transactionsReducer, { sortTransactionsByDateTime, selectTransactions } from '@/features/budget-tracker/transactionsSlice';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import styles from './TransactionList.module.scss';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment, { Moment } from 'moment';

type TransactionList = {
    handleTransactionId: (id: string) => void;
}
const TransactionList: React.FC<TransactionList> = ({handleTransactionId}) => {
    const dispatch = useAppDispatch();
    const [category, setCategory] = useState('');
	const transactions = useAppSelector(selectTransactions);

	useEffect(() => {
		dispatch(sortTransactionsByDateTime('asc'));
    }, [dispatch]);

    return (
      <div className={styles.container}>
        {
            Array.isArray(transactions) && transactions.length === 0 ? (
                <div className={styles.emptyList}>No transaction found</div>
            ) : (
                <div className={styles.transactionTable}>
                    <div className={styles.listHeader}>
                        <div className={styles.type}>Type</div>
                        <div className={styles.amount}>Amount</div>
                        <div className={styles.category}>Category</div>
                        <div className={styles.dateTime}>Date</div>
                    </div>
                    {transactions.map((tx: TransactionType) => (
                        <div
                            className={`${styles.transactionItem} ${tx.type === 'Expense' ? styles.expense : styles.income}`}
                            key={tx._id}
                        >   
                            <div className={styles.type}><span>{tx.type}</span></div>
                            <div className={styles.amount}>{tx.amount}</div>
                            <div className={styles.category}>{tx.category}</div>
                            <div className={styles.dateTime}>{moment(tx.dateTime).format('DD/MM/YYYY HH:mm')}</div>
                            <div className={styles.action}><button onClick={()=>handleTransactionId(tx._id)}>Edit</button></div>
                        </div>
                    ))}
                </div>
            )
        }
      </div>
    );
};

export default TransactionList;