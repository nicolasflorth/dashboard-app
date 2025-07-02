import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

export { generateAccessToken, generateRefreshToken };
