import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import './ConfirmDeleteDialog.module.scss';

type ConfirmDeleteDialogProps = {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
	open,
	onCancel,
	onConfirm,
}) => (
	<Dialog open={open} onClose={onCancel}>
		<DialogTitle>Confirm Deletion</DialogTitle>
		<DialogContent>
			<DialogContentText>
				Are you sure you want to delete this transaction?
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={onCancel}>Cancel</Button>
			<Button onClick={onConfirm} color="error" variant="contained">
				Delete
			</Button>
		</DialogActions>
	</Dialog>
);

export default ConfirmDeleteDialog;
