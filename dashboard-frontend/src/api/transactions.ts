import httpClient from './httpClient';
import { TransactionType } from '@/types/transaction';

export const fetchTransactions = async (userId: string): Promise<TransactionType[]> => {
    const res = await httpClient.get(`/users/${userId}/transactions`);    
    if (!Array.isArray(res.data)) {
        console.warn('Unexpected response:', res.data);
        throw new Error('Invalid response format');
    }
    console.log("res.data:", res.data);
    return res.data;
};

export const createTransaction = async (userId: string, data: Partial<TransactionType>) => {
    const res = await httpClient.post(`/users/${userId}/transactions`, data);
    return res.data;
};

export const updateTransaction = async (userId: string, transactionId: string,  data: Partial<TransactionType>) => {
    const res = await httpClient.put(`/users/${userId}/transactions/${transactionId}`, data);
    return res.data;
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
    const res = await httpClient.delete(`/users/${userId}/transactions/${transactionId}`);
    return res.data;
};
