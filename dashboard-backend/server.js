import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import usersRoutes from './routes/users.js';
import transactionsRoutes from './routes/transactions.js';
import seedDummyUser from './utils/seedDummyUser.js';
import seedDummyTransactions from './utils/seedDummyTransactions.js';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

mongoose.connect('mongodb://localhost:27017/dashboard-app')
	.then(async () => {
		console.log('Connected to MongoDB');

		const user = await seedDummyUser();

		if (!user) {
			console.error('Cannot seed transactions without user');
			process.exit(1);
		}

		await seedDummyTransactions(user);

		app.listen(4000, () => {
			console.log('Server is running on http://localhost:4000');
		});
	})
	.catch((err) => { // Catches errors during the initial connection
		console.error('Failed to connect to MongoDB:', err);
	});

const db = mongoose.connection;
// If the connection drops later it will catch the error
db.on('error', (error) => {
	console.error('MongoDB runtime error:', error);
});



// CORS options
const corsOptions = {
	origin: 'http://localhost:5173', // The frontend URL
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
// CORS middleware applied globally. This will also handle preflight OPTIONS requests.
app.use(cors(corsOptions));
//app.options('*', cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
	console.log(`********** [${req.method}] ${req.url}`, req.body);
	next();
});

// must be before the routes
app.use(cookieParser());

app.use('/users', usersRoutes);
app.use('/users', transactionsRoutes);

// for development purposes
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});
