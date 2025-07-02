import { TransactionTypeEnum } from './transactionTypes';

export interface TransactionType {
    _id: string;
    amount: number;
    type: TransactionTypeEnum;
    category: string;
    dateTime: string;
}