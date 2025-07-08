import { useState, lazy, Suspense } from 'react';
import AddTransactionForm from "@/features/budget-tracker/components/AddTransactionForm/AddTransactionForm";
import CategoriesFilters from "@/features/budget-tracker/components/CategoryFilter/CategoriesFilters";
import TransactionList from "@/features/budget-tracker/components/TransactionList/TransactionList";
import Summary from "@/features/budget-tracker/components/Summary/Summary";
const Popup = lazy(() => import('@/shared/components/Popup/Popup'));
import { renderLoader } from '@/shared/components/Loader/Loader';
import styles from './Transactions.module.scss';
import Breadcrumbs from '@/shared/components/Breadcrumbs/Breadcrumbs';

function Transactions() {
	const [isOpen, setOpen] = useState(false);
	const [transactionId, setTransactionId] = useState('');

	const handleTransactionId = (id: string) => {
		setTransactionId(id);
		setOpen(true);
	}

	return (
		<main className="">
			<div>
				<Breadcrumbs />
				<h1>Transactions</h1>
				<div className={styles.overList}>
					<Summary variant="transactions" />
					<button className={styles.addTransactionButton} onClick={() => { isOpen === false ? setOpen(true) : setOpen(false) }}>+ Add transaction</button>
				</div>
				{isOpen && (
					<Suspense fallback={renderLoader()}>
						<Popup isOpen={isOpen} onClose={() => { setOpen(false); setTransactionId('') }}>
							<AddTransactionForm transactionId={transactionId} onSuccess={() => { setOpen(false); setTransactionId('') }} />
						</Popup>
					</Suspense>
				)}
				<TransactionList handleTransactionId={handleTransactionId} />
				<CategoriesFilters />
			</div>
		</main>
	);
}

export default Transactions;
