import React, { useMemo } from 'react';
import moment from 'moment';
import styles from './TransactionList.module.scss';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef, } from '@tanstack/react-table';
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

	const columns = useMemo<ColumnDef<TransactionType>[]>(
		() => [
			{
				header: t('type', { ns: 'features/transactions/list' }),
				accessorKey: 'type',
				cell: info => (
					<span className={info.row.original.type === 'Expense' ? styles.expense : styles.income}>
						{info.getValue() === 'Expense' ? t('expense') : t('income')}
					</span>
				),
			},
			{
				header: t('amount', { ns: 'features/transactions/list' }),
				accessorKey: 'amount',
			},
			{
				header: t('category', { ns: 'features/transactions/list' }),
				accessorKey: 'category',
			},
			{
				header: t('date', { ns: 'features/transactions/list' }),
				accessorKey: 'dateTime',
				cell: info => moment(info.getValue() as string).format('DD/MM/YYYY HH:mm'),
			},
			{
				header: '',
				id: 'actions',
				cell: ({ row }) => (
					<div className={styles.action}>
						<button onClick={() => handleTransactionId(row.original._id)}>{t('edit', { ns: 'common' })}</button>
						<button onClick={() => requestDelete(row.original._id)}>{t('delete', { ns: 'common' })}</button>
					</div>
				),
			},
		],
		[t, handleTransactionId, requestDelete]
	);

	const table = useReactTable({
		data: transactions,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className={styles.container}>
			<ConfirmDeleteDialog
				open={confirmOpen}
				onCancel={cancel}
				onConfirm={handleConfirmDelete}
			/>

			{Array.isArray(transactions) && transactions.length === 0 ? (
				<div className={styles.emptyList}>{t('noTransactions', { ns: 'features/transactions/list' })}</div>
			) : (
				<div className={styles.transactionTable}>
					<div className={styles.listHeader}>
						{table.getHeaderGroups().map(headerGroup =>
							headerGroup.headers.map(header => (
								<div key={header.id} className={styles[header.column.id as keyof typeof styles]}>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</div>
							))
						)}
					</div>
					<div className={styles.listBody}>
						{table.getRowModel().rows.map(row => (
							<div
								key={row.id}
								className={`${styles.transactionItem} ${row.original.type === 'Expense' ? styles.expense : styles.income
									}`}
							>
								{row.getVisibleCells().map(cell => (
									<div key={cell.id} className={styles[cell.column.id as keyof typeof styles]}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default TransactionList;
