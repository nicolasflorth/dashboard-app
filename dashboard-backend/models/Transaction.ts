import mongoose from 'mongoose';

export interface ITransaction {
	userId: mongoose.Schema.Types.ObjectId;
	amount: number;
	type: 'Income' | 'Expense';
	category: string;
	dateTime: Date;
}

const transactionSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	amount: { type: Number, required: true },
	type: { type: String, enum: ['Income', 'Expense'], required: true },
	category: { type: String, required: true },
	dateTime: { type: Date, required: true },
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;