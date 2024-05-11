import { createClient, RedisClientType } from "redis";

let client: RedisClientType;

export const initializeRedis = async () => {
  if (!client) {
    console.log(process.env.REDIS_URL || 'redis://:yourpassword@message-delete-db:6380')

    client = createClient({
      url: process.env.REDIS_URL || 'redis://:yourpassword@message-delete-db:6379',
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
    console.log("Connected to Redis");
  }
};

export const getClient = (): RedisClientType => {
  if (!client) {
    throw new Error("Must initialize Redis client before getting it");
  }
  return client;
};

export const setKey = async (
  key: string,
  value: string,
  expiration: number
) => {
  await getClient().set(key, value, { EX: expiration });
};

export const getKey = async (key: string): Promise<string | null> => {
  return await getClient().get(key);
};

export const deleteKey = async (key: string) => {
  await getClient().del(key);
};
