import React from 'react';
import moment from 'moment';
import styles from './TransactionList.module.scss';
import type { TransactionType } from '@/types/transaction';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectTransactions, deleteTransactionAsync } from '@/features/budget-tracker/transactionsSlice';
import { selectUser } from '@/features/auth/authSlice';
import { User } from '@/types/user';
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

type TransactionList = {
	handleTransactionId: (id: string) => void;
};

const TransactionList: React.FC<TransactionList> = ({ handleTransactionId }) => {
	const dispatch = useAppDispatch();
	const transactions = useAppSelector(selectTransactions);
	const user = useAppSelector(selectUser) as User | null;
	const userId = user?._id;

	const {
		confirmOpen,
		pendingId,
		requestDelete,
		confirm,
		cancel,
	} = useConfirmDelete();

	const handleConfirmDelete = () => {
		const id = confirm();
		if (id && userId) {
			dispatch(deleteTransactionAsync({ userId, transactionId: id }));
			console.log(`Transaction with id ${id} deleted`);
		} else {
			console.error('User ID or transaction ID is missing');
		}
	};

	return (
		<div className={styles.container}>
			<ConfirmDeleteDialog
				open={confirmOpen}
				onCancel={cancel}
				onConfirm={handleConfirmDelete}
			/>

			{Array.isArray(transactions) && transactions.length === 0 ? (
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
							<div className={styles.action}>
								<button onClick={() => handleTransactionId(tx._id)}>Edit</button>
								<button onClick={() => requestDelete(tx._id)}>Delete</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TransactionList;
