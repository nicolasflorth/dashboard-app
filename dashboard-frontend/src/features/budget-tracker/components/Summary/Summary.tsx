import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import styles from './Summary.module.scss';
import clsx from 'clsx';
import summaryReducer, { selectTotalAmount, selectTransactionCount } from '@/features/budget-tracker/transactionsSlice';

type Props = {
  className?: string;
  variant?: 'dashboard' | 'transactions';
};

const Summary: React.FC<Props> = ({ className = '', variant = 'dashboard' }) => {

    const totalAmount = useSelector<RootState, number>(selectTotalAmount);
    const transactionCount = useSelector<RootState, number>(selectTransactionCount);
    let content;
    if (variant === 'dashboard') {
      content = (
        <div className={`${styles.summary} ${styles.dashboard}`}>
          <div className={styles.row}>
            <div className='label'>Total Amount: </div>
            <div className='value'>{totalAmount < 0 ? `-£${Math.abs(totalAmount)}` : `£${totalAmount}`}</div>
          </div>
          <div className={styles.row}>
            <div className='label'>Total transactions: </div>
            <div className='value'>{transactionCount}</div>
          </div>
        </div>
      );
    } else {
      content = (
        <div className={`${styles.summary} ${styles.transactions}`}>
          <span>
            <strong>{transactionCount}</strong> transactions totaling{' '}
            <strong>{totalAmount < 0 ? `-£${Math.abs(totalAmount)}` : `£${totalAmount}`}</strong>
          </span>
        </div>
      );
    }
    return content;
}

export default Summary;