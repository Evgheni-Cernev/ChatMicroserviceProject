import bcrypt from "bcrypt";
import { User, UserInstance } from "../models";
import { generateToken } from "../utils/tokenUtils";
import { Op } from 'sequelize';
import forge from "node-forge";

const generateKeyPair = () => {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
  return {
    publicKey: forge.pki.publicKeyToPem(publicKey),
    privateKey: forge.pki.privateKeyToPem(privateKey),
  };
};

export class UserService {
  async createUser(data: UserInstance) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { publicKey, privateKey } = generateKeyPair();

    const user = await User.create({
      ...data,
      password: hashedPassword,
      publicKey,
      privateKey,
    });
    return user;
  }

  async authenticateUser(username: string, password: string) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.password);
    return { token, user_id: user.id };
  }

  async getUserById(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await User.findOne({ where: { email }, attributes: { exclude: ['password'] }  });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserAll(userId: string) {
    const user = await User.findAll({
      where: {
        id: {
          [Op.not]: userId
        }
      },
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(userId: number, data: UserInstance) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (data.username) {
      user.username = data.username;
    }
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    if (data.age !== undefined) {
      user.age = data.age;
    }
    if (data.firstName !== undefined) {
      user.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      user.lastName = data.lastName;
    }
    if (data.country !== undefined) {
      user.country = data.country;
    }
    if (data.region !== undefined) {
      user.region = data.region;
    }
    if (data.language !== undefined) {
      user.language = data.language;
    }
    if (data.biography !== undefined) {
      user.biography = data.biography;
    }
    if (data.socialLinks !== undefined) {
      user.socialLinks = data.socialLinks;
    }
    if (data.role !== undefined) {
      user.role = data.role;
    }
    if (data.notifications !== undefined) {
      user.notifications = data.notifications;
    }

    await user.save();
    return user;
  }

  async updateAvatar(userId: number, file?: Express.Multer.File) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (!file) {
      throw new Error("Avatar file is required");
    }

    user.avatar = file.filename;
    await user.save();

    return user;
  }
}
