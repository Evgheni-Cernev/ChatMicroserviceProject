import bcrypt from 'bcrypt';
import { User } from '../models';
import { generateToken } from '../utils/tokenUtils';

export class UserService {
  async createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword
    });
    return user;
  }

  async authenticateUser(username: string, password: string) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
        throw new Error('User not found');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user.password);
    return {token, user_id: user.id};
}

  async getUserById(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(userId: number, username?: string, password?: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.username = username || user.username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    return user;
  }
}
