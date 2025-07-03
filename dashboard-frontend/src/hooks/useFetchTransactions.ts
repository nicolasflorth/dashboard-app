import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { fetchTransactionsAsync, sortTransactionsByDateTime } from '@/features/budget-tracker/transactionsSlice';
import { selectUser } from '@/features/auth/authSlice';
import { User } from '@/types/user';

export const useFetchTransactions = (sortOrder: 'asc' | 'desc' = 'asc') => {
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser) as User | null;
	const userId = user?._id;

	useEffect(() => {
		if (userId) {
			dispatch(fetchTransactionsAsync(userId)).then(() => {
				dispatch(sortTransactionsByDateTime(sortOrder));
			});
		}
	}, [dispatch, userId, sortOrder]);
};