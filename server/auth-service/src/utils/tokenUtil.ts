import jwt from 'jsonwebtoken';
import config from '../config/config';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, config.jwtSecret);
};
