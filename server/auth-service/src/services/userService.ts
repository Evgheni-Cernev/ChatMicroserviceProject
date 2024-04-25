import axios from "axios";
import bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export class UserService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/users/email/${email}`
      );
      return response.data as User;
    } catch (error) {
      return null;
    }
  }

  public async validateUser(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        return false;
      }

      const isValid = await bcrypt.compare(password, user.password);
      return isValid;
    } catch (error) {
      console.error("Error validating user:", error);
      return false;
    }
  }

  public async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<User | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/register`, {
        username: name,
        password,
        email,
      });
      return response.data as User;
    } catch (error) {
      console.error("Error register user:", error);
      return null;
    }
  }
}
