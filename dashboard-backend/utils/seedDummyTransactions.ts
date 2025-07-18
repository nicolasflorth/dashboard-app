import Transaction from '../models/Transaction.ts';
import { IUser } from '../models/User.ts';

const categories = ['Food', 'Rent', 'Salary', 'Shopping', 'Health', 'Transport'];

const seedDummyTransactions = async (user: IUser) => {
    if (!user || !user._id) {
        console.error('No user ID provided for seeding transactions.');
        return;
    }
    
    const existingTransactions = await Transaction.countDocuments({ userId: user._id });
    if (existingTransactions < 10) {
        const dummyTransactions = Array.from({ length: 10 }, () => ({
            userId: user._id,
            amount: Math.floor(Math.random() * 500) + 10,
            type: Math.random() > 0.5 ? 'Income' : 'Expense',
            category: categories[Math.floor(Math.random() * categories.length)],
            dateTime: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
        }));

        await Transaction.insertMany(dummyTransactions);
        console.log('Inserted 10 dummy transactions for user:', user.username);
    } else {
        console.log(`User ${user.username} already has ${existingTransactions} transactions. No need to insert.`);
    }
};

export default seedDummyTransactions;
