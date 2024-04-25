import { createClient, RedisClientType } from 'redis';

export class RedisService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL  
        });
        this.client.connect();

        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    async saveSession(token: string, userId: string): Promise<void> {
        await this.client.set(token, userId, {
            EX: 3600,
        });
    }

    async getSession(token: string): Promise<string | null> {
        return await this.client.get(token);
    }

    async deleteSession(token: string): Promise<void> {
        await this.client.del(token);
    }
}
