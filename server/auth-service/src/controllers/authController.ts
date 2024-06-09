import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { TokenService } from '../services/tokenService';
import { RedisService } from '../services/redisService';

class AuthController {
  private userService: UserService;
  private tokenService: TokenService;
  private redisService: RedisService;

  constructor(
    userService: UserService,
    tokenService: TokenService,
    redisService: RedisService
  ) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.redisService = redisService;
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const userExists = await this.userService.getUserByEmail(email);

      if (userExists) {
        res.status(409).send('Email already in use');
        return;
      }
      const user = await this.userService.createUser(email, password, name);
      if (user) {
        const token = this.tokenService.generateToken(user.id);
        await this.redisService.saveSession(token, user.id);
        res.status(201).send({ user, token });
      } else {
        res.status(400).send('Unable to create user');
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Internal server error');
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      // const isValid = await this.userService.validateUser(email, password);
      const user = await this.userService.getUserByEmail(email);

      if (user) {
        const token = this.tokenService.generateToken(user.id);
        await this.redisService.saveSession(token, user.id);
        res.status(200).send({ token, user });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        res.status(401).send('Token invalid');
        return;
      }

      const userId = await this.redisService.getSession(token);
      if (userId) {
        await this.redisService.deleteSession(token);
        res.status(200).send('Logged out successfully');
        return;
      } else {
        res.status(401).send('Token expired or invalid');
        return;
      }
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).send('Server error');
      return;
    }
  }

  public async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const userId = await this.redisService.getSession(token);
      if (userId && this.tokenService.verifyToken(token)) {
        res.status(200).send(true);
      } else {
        res.status(401).send(false);
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  public async verifyTokenGetUser(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const userId = await this.redisService.getSession(token);
      if (userId && this.tokenService.verifyToken(token)) {
        res.status(200).send(userId);
      } else {
        res.status(401).send(false);
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  }
}

export default AuthController;
