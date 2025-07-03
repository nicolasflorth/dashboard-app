
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
const router = express.Router();

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Example: Find user in DB (replace this with real password check in production)
    const user = await User.findOne({ email });

    if (!user || password !== 'emilyspass') {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
    /*
    // Return public user data and tokens
    return res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        roles: user.roles,
        accessToken,
    });*/
});

router.post('/auth/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401); // No token

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);

        const userData = { id: payload.id, username: user.username }; // match your token contents

        const newAccessToken = generateAccessToken(userData);

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

router.post('/auth/logout', (req, res) => {
    const cookies = req.cookies;
    console.log('POST /users/auth/logout called', cookies);
    if (!cookies?.jwt) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    // find the user with the refresh token
    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
        return res.sendStatus(204);
    }

    // remove the refresh token
    const updatedUsers = usersDB.users.map(user =>
        user.refreshToken === refreshToken ? { ...user, refreshToken: '' } : user
    );
    usersDB.setUsers(updatedUsers);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
    return res.sendStatus(204);
});

export default router;