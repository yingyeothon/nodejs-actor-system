import connect, {
  RedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

const isRedisNotSupported = () =>
  !process.env.TEST_REDIS_PORT || !process.env.TEST_REDIS_HOST;

const redisWork = async (
  cb: (connection: RedisConnection) => Promise<unknown>
) => {
  if (isRedisNotSupported()) {
    console.log(`No test env: TEST_REDIS_PORT, TEST_REDIS_HOST`);
    return;
  }
  const connection = connect({
    host: process.env.TEST_REDIS_HOST!,
    port: +process.env.TEST_REDIS_PORT!,
    timeoutMillis: 1000,
  });
  try {
    await cb(connection);
  } finally {
    connection.socket.disconnect();
  }
};

export const testRedis = (
  name: string,
  cb: (connection: RedisConnection) => Promise<unknown>
): void => {
  if (isRedisNotSupported()) {
    // A dummy test to ignore jest errors.
    test(name, () => expect(true).toEqual(true));
    return;
  }
  test(name, async () => {
    await redisWork(cb);
  });
};
