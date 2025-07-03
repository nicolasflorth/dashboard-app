import { useState } from 'react';

export function useConfirmDelete() {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pendingId, setPendingId] = useState<string | null>(null);

	const requestDelete = (id: string) => {
		setPendingId(id);
		setConfirmOpen(true);
	};

	const confirm = () => {
		const id = pendingId;
		setPendingId(null);
		setConfirmOpen(false);
		return id;
	};

	const cancel = () => {
		setPendingId(null);
		setConfirmOpen(false);
	};

	return {
		confirmOpen,
		pendingId,
		requestDelete,
		confirm,
		cancel,
	};
}
