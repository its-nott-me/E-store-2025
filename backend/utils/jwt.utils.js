import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshSecret);
};