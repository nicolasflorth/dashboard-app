import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { sortTransactionsByDateTime, createTransactionAsync, updateTransactionAsync, selectTransactions } from '@/features/budget-tracker/transactionsSlice';
import sanitizeNumberInput from '@/utils/sanitizeNumberInput';
import styles from './AddTransactionForm.module.scss';
import { updateTotalAmount } from '@/features/budget-tracker/summarySlice';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { Moment } from 'moment';
import { selectUser } from '@/features/auth/authSlice';
import { User } from '@/types/user';
import type { RootState } from '@/app/store';

type AddTransactionFormProps = {
    onSuccess: () => void;
    transactionId?: string
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSuccess, transactionId }) => {
    const dispatch = useAppDispatch();
    const transactions = useAppSelector(selectTransactions);
    const createError = useAppSelector((state: RootState) => state.transactions.create.error);
    const updateError = useAppSelector((state: RootState) => state.transactions.update.error);
    const deleteError = useAppSelector((state: RootState) => state.transactions.delete.error);

    const editingTransaction = transactionId
        ? transactions.find(transaction => transaction._id === transactionId)
        : undefined;

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'Income' | 'Expense'>('Income');
    const isEditing = !!editingTransaction;
    const [dateTime, setDateTime] = useState<Date>(isEditing ? new Date(editingTransaction.dateTime) : new Date());
    const user = useAppSelector(selectUser) as User | null;
    const userId = user?._id;

    const handleDateTimeChange = (value: string | Moment | null) => {
        if (!value) return;

        let date: Date;

        if (typeof value === 'string') {
            const parsed = new Date(value);
            if (isNaN(parsed.getTime())) {
                console.warn("Invalid date string:", value);
                return;
            }
            date = parsed;
        } else {
            date = value.toDate(); // Moment -> Date
        }

        setDateTime(date);
    };


    useEffect(() => {
        if (isEditing) {
            setAmount(editingTransaction.amount.toString());
            setCategory(editingTransaction.category);
            setType(editingTransaction.type);
            setDateTime(new Date(editingTransaction.dateTime));
        } else {
            setAmount('');
            setCategory('');
            setType('Income');
        }
    }, [editingTransaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('User ID in form:', userId);
        if (!userId) return;

        if (!amount || !category) return;
        const sanitizedAmount = sanitizeNumberInput(amount);
        if (sanitizedAmount === null) {
            return;
        }

        if (isEditing) {
            // Dispatch edit action
            dispatch(updateTransactionAsync({
                userId: userId,
                transactionId: editingTransaction._id,
                data: {
                    ...editingTransaction,
                    amount: parseFloat(sanitizedAmount),
                    type,
                    category,
                    dateTime: new Date(dateTime).toISOString(),
                },
            })).then((action) => {
                if (updateTransactionAsync.fulfilled.match(action)) {
                    dispatch(sortTransactionsByDateTime('desc'));
                    const newTotalAmount = transactions.reduce(
                        (sum, transaction) => sum + transaction.amount,
                        parseFloat(sanitizedAmount)
                    );
                    dispatch(updateTotalAmount(newTotalAmount));
                    // Reset form
                    setAmount('');
                    setCategory('');
                    onSuccess();
                }
            });
        } else {
            dispatch(createTransactionAsync({
                userId: userId,
                data: {
                    amount: parseFloat(sanitizedAmount),
                    type,
                    category,
                    dateTime: new Date().toISOString(),
                }
            })).then((action) => {
                if (createTransactionAsync.fulfilled.match(action)) {
                    dispatch(sortTransactionsByDateTime('desc'));
                    const newTotalAmount = transactions.reduce(
                        (sum, transaction) => sum + transaction.amount,
                        parseFloat(sanitizedAmount)
                    );
                    dispatch(updateTotalAmount(newTotalAmount));
                    // Reset form
                    setAmount('');
                    setCategory('');
                    onSuccess();
                }
            });
        }
        const newTotalAmount = transactions.reduce(
            (sum, transaction) => sum + transaction.amount, parseFloat(sanitizedAmount)
        )
        dispatch(updateTotalAmount(newTotalAmount));

        // reset the form
        setAmount('');
        setCategory('');
    };

    return (
        <div className={styles.addTransactions}>
            <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <form onSubmit={handleSubmit} className={styles.addTransactionForm}>
                <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <select className={styles.type} value={type} onChange={(e) => setType(e.target.value as 'Income' | 'Expense')}>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>
                {isEditing &&
                    <Datetime
                        value={dateTime}
                        onChange={handleDateTimeChange}
                        dateFormat="DD/MM/YYYY"
                        timeFormat="HH:mm"
                    />
                }
                <button type="submit" data-testid="transaction-form-submit">{isEditing ? 'Save' : 'Add'}</button>
            </form>
            {(createError || updateError || deleteError) && (
                <div className={styles.errorBox} data-testid="transaction-error">
                    {createError || updateError || deleteError}
                </div>
            )}
        </div>
    );
}

export default AddTransactionForm;