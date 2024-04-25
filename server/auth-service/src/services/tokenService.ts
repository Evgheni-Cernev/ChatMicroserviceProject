import jwt from 'jsonwebtoken';
import config from '../config/config';

export class TokenService {
    generateToken(userId: string): string {
        return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
    }

    verifyToken(token: string): boolean {
        try {
            jwt.verify(token, config.jwtSecret);
            return true;
        } catch {
            return false;
        }
    }
}
