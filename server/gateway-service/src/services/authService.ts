import axios from "axios";

export class AuthService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async validateUser(token: string): Promise<boolean> {
    try {
      const {status} = await axios.post(
        `${this.baseUrl}/verify-token`,
        {
          token,
        }
      );
      return status === 200;
    } catch (error) {
      console.error("Error fverify token:", error);
      return false;
    }
  }
}
