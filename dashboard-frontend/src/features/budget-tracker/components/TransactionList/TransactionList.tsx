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
import { useTranslation } from "react-i18next";

type TransactionList = {
	handleTransactionId: (id: string) => void;
};

const TransactionList: React.FC<TransactionList> = ({ handleTransactionId }) => {
	const { t } = useTranslation(["common", "features/transactions/list"]);
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
						<div className={styles.type}>{t("type", { ns: "features/transactions/list"})}</div>
						<div className={styles.amount}>{t("amount", { ns: "features/transactions/list"})}</div>
						<div className={styles.category}>{t("category", { ns: "features/transactions/list"})}</div>
						<div className={styles.dateTime}>{t("date", { ns: "features/transactions/list"})}</div>
					</div>
					{transactions.map((tx: TransactionType) => (
						<div
							className={`${styles.transactionItem} ${tx.type === 'Expense' ? styles.expense : styles.income}`}
							key={tx._id}
						>
							<div className={styles.type}><span>{tx.type === 'Expense' ? t("expense") : t("income")}</span></div>
							<div className={styles.amount}>{tx.amount}</div>
							<div className={styles.category}>{tx.category}</div>
							<div className={styles.dateTime}>{moment(tx.dateTime).format('DD/MM/YYYY HH:mm')}</div>
							<div className={styles.action}>
								<button onClick={() => handleTransactionId(tx._id)}>{t("edit", "common")}</button>
								<button onClick={() => requestDelete(tx._id)}>{t("delete", "common")}</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TransactionList;
