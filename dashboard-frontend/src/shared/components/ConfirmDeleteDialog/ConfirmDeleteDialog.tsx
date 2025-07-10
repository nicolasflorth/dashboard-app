import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import './ConfirmDeleteDialog.module.scss';
import { useTranslation } from "react-i18next";

type ConfirmDeleteDialogProps = {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
	open,
	onCancel,
	onConfirm,
}) => {
	const { t } = useTranslation(["common", "features/transactions/list"]);
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogTitle>{t("confirmDeletion", { ns: "features/transactions/list"})}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("confirmDeletionQuestion", { ns: "features/transactions/list"})}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>{t("cancel", { ns: "common"})}</Button>
				<Button onClick={onConfirm} color="error" variant="contained">
					{t("delete", { ns: "common"})}
				</Button>
			</DialogActions>
		</Dialog>
	)
};

export default ConfirmDeleteDialog;
