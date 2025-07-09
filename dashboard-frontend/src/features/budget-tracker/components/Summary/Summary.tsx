import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import styles from './Summary.module.scss';
import { selectTotalAmount, selectTransactionCount } from '@/features/budget-tracker/transactionsSlice';
import { useTranslation } from "react-i18next";

type Props = {
	className?: string;
	variant?: 'dashboard' | 'transactions';
};

const Summary: React.FC<Props> = ({ className = '', variant = 'dashboard' }) => {
	const { t } = useTranslation(['common', 'features/transactions/summary']);

	const totalAmount = useSelector<RootState, number>(selectTotalAmount);
	const transactionCount = useSelector<RootState, number>(selectTransactionCount);
	let content;
	if (variant === 'dashboard') {
		content = (
			<div className={`${styles.summary} ${styles.dashboard}`}>
				<div className={styles.row}>
					<div className='label'>{t("totalAmount", { ns: "features/transactions/summary" })}: </div>
					<div className='value'>{totalAmount < 0 ? `-£${Math.abs(totalAmount)}` : `£${totalAmount}`}</div>
				</div>
				<div className={styles.row}>
					<div className='label'>{t("totalTransactions", { ns: "features/transactions/summary" })}: </div>
					<div className='value'>{transactionCount}</div>
				</div>
			</div>
		);
	} else {
		content = (
			<div className={`${styles.summary} ${styles.transactions}`}>
				<span>
					<strong>{transactionCount}</strong> {transactionCount === 1 ? t("transaction") : t("transactions")} {t("totaling")}&nbsp;
					<strong>{totalAmount < 0 ? `-£${Math.abs(totalAmount)}` : `£${totalAmount}`}</strong>
				</span>
			</div>
		);
	}
	return content;
}

export default Summary;