
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.ts';
import Transaction from '../models/Transaction.ts';
import { generateAccessToken, generateRefreshToken, generateEmailToken, verifyEmailToken } from '../utils/token.ts';
import { sendConfirmationEmail } from '../utils/mailer.ts';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

router.post('/auth/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('username').notEmpty().isLength({ min: 2 }).withMessage('Username must be at least 2 chars'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('firstName').notEmpty().isLength({ min: 2 }).withMessage('FirstName must be at least 2 chars'),
    body('lastName').notEmpty().isLength({ min: 2 }).withMessage('LastName must be at least 2 chars'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, username, password, firstName, lastName } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        console.log('Original password:', password);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            firstName,
            lastName,
            activated: false,
            roles: ['user'],
            refreshToken: '',
        });

        await newUser.save();

        const emailToken = generateEmailToken(newUser._id.toString());
        await sendConfirmationEmail(email, emailToken);

        // Send success message (no loggin at this point)
        res.status(201).json({ message: 'Registration successful. Please check your email to confirm your account.' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/auth/confirm/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = verifyEmailToken(token);

        await User.findByIdAndUpdate(decoded.userId, { activated: true });

        res.redirect(`${process.env.CLIENT_URL}/login?confirmed=true`);
    } catch (err) {
        console.error(err);
        res.redirect(`${process.env.CLIENT_URL}/login?confirmed=false`);
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'User does not exist' });
    }
    
    if (!user.activated) {
        return res.status(403).json({ message: 'Please confirm your email before logging in.' });
    }

    // Check password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
        _id: user._id.toString(),
        username: user.username,
    });
    const refreshToken = generateRefreshToken({
        _id: user._id.toString(),
        username: user.username,
    });

    // Save refresh token to DB
    try {
        await User.findByIdAndUpdate(user._id, { refreshToken });
    } catch (error) {
        console.error('Error saving refresh token to DB:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    // Set cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false, // Set to true if using HTTPS
        maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false, // Set to true if using HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userWithRoles = {
        ...user.toObject(),
        roles: ['admin'],
    };

    res.json({ ...userWithRoles, accessToken, refreshToken });
});

router.post('/auth/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401); // No token

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { _id: string; username: string };

        const user = await User.findById(payload._id);

        if (!user) return res.sendStatus(404);

        const newAccessToken = generateAccessToken({
            _id: user._id.toString(),
            username: user.username,
        });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.sendStatus(403); // Invalid or expired token
    }
});

router.post('/auth/logout', async (req, res) => {
    const cookies = req.cookies;
    console.log('POST /users/auth/logout called', cookies);
    if (!cookies?.jwt) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    // Find the user with the refresh token
    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
    return res.sendStatus(204);
});

export default router;