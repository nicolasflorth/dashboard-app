import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useSelector } from 'react-redux';
import transactionsReducer, { addTransaction, updateTransaction, selectTransactions } from '@/features/budget-tracker/transactionsSlice';
import sanitizeNumberInput from '@/utils/sanitizeNumberInput';
import styles from './AddTransactionForm.module.scss';
import { updateTotalAmount } from '@/features/budget-tracker/summarySlice';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment, { Moment } from 'moment';

type AddTransactionFormProps = {
    onSuccess: () => void;
    transactionId?: string
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({onSuccess, transactionId}) => {
    const dispatch = useAppDispatch();
    const transactions = useSelector(selectTransactions);
    const editingTransaction = transactionId
        ? transactions.find(transaction => transaction._id === transactionId)
        : undefined;

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'Income' | 'Expense'>('Income');
    const isEditing = !!editingTransaction;
    const [dateTime, setDateTime] = useState<Date>(isEditing ? new Date(editingTransaction.dateTime) : new Date());
    
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


    useEffect(()=> {
        if(isEditing){
            setAmount(editingTransaction.amount.toString());
            setCategory(editingTransaction.category);
            setType(editingTransaction.type);
            setDateTime(new Date(editingTransaction.dateTime));
        }else{
            setAmount('');
            setCategory('');
            setType('Income');
        }
    }, [editingTransaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!amount || !category) return;
        const sanitizedAmount = sanitizeNumberInput(amount);
        if (sanitizedAmount === null) {
            return;
        }

        if (isEditing){
            // Dispatch edit action (implement this in your slice)
            dispatch(updateTransaction({ 
                ...editingTransaction, 
                amount: parseFloat(sanitizedAmount), 
                type,
                category,
                dateTime: new Date(dateTime).toISOString(),
            }));
            onSuccess();
        } else {
            dispatch(addTransaction({
                _id: crypto.randomUUID(),
                amount: parseFloat(sanitizedAmount),
                type,
                category,
                dateTime: new Date().toISOString(),
            }));
        }
        const newTotalAmount = transactions.reduce(
            (sum, transaction) => sum + transaction.amount, parseFloat(sanitizedAmount)
        )
        dispatch(updateTotalAmount(newTotalAmount));
    
        // reset form
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
                <button type="submit">{isEditing ? 'Save' : 'Add'}</button>
            </form>
        </div>
    );
}

export default AddTransactionForm;