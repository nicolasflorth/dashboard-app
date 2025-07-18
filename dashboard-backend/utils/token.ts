import jwt, { JwtPayload } from 'jsonwebtoken';

const generateAccessToken = (user: { _id: string; username: string }) => {
	return jwt.sign(
		{ id: user._id, username: user.username },
		process.env.ACCESS_TOKEN_SECRET!,
		{ expiresIn: '15m' }
	);
};

const generateRefreshToken = (user: { _id: string; username: string }) => {
	return jwt.sign(
		{ id: user._id },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: '7d' }
	);
};

const generateEmailToken = (userId: string) => {
	return jwt.sign({ userId }, process.env.EMAIL_SECRET!, { expiresIn: '1h' });
};

const verifyEmailToken = (token: string): JwtPayload & { userId: string } => {
	const decoded = jwt.verify(token, process.env.EMAIL_SECRET!);

	if (typeof decoded === 'string') {
		throw new Error('Invalid token payload');
	}

	return decoded as JwtPayload & { userId: string };
};

export { generateAccessToken, generateRefreshToken, generateEmailToken, verifyEmailToken };
