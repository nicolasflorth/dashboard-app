
import express from 'express';
import Transaction from '../models/Transaction.js';
const router = express.Router();

router.get('/:userId/transactions', async (req, res) => {
    const userId = req.params.userId;
    console.log('GET /users/:userId/transactions called with ID:', userId);
    try {
        const transactions = await Transaction.find({ userId });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Create a new transaction
router.post('/:userId/transactions', async (req, res) => {
    console.log('Received data:', req.body);
    const { userId } = req.params;
    console.log('POST /users/:userId/transactions called with ID:', userId);
    
    // Simulate a forced error
    //return res.status(400).json({ error: 'API error from backend' });

    const { amount, type, category, dateTime } = req.body;
    try {
        const newTransaction = new Transaction({
            userId,
            amount,
            type,
            category,
            dateTime,
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create transaction' });
    }
});

// Update a transaction
router.put('/:userId/transactions/:id', async (req, res) => {
    const { userId } = req.params;
    const transaction = await Transaction.findOneAndUpdate(
        { _id: req.params.id, userId },
        req.body,
        { new: true }
    );
    if (!transaction) return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    res.json(transaction);
});

// Delete a transaction
router.delete('/:userId/transactions/:id', async (req, res) => {
    const { userId } = req.params;
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    res.sendStatus(204);
});

export default router;