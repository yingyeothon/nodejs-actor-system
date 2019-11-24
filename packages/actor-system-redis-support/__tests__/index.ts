import * as IORedis from "ioredis";

const isRedisNotSupported = () =>
  !process.env.TEST_REDIS_PORT || !process.env.TEST_REDIS_HOST;

const redisWork = async (cb: (redis: IORedis.Redis) => Promise<any>) => {
  if (isRedisNotSupported()) {
    console.log(`No test env: TEST_REDIS_PORT, TEST_REDIS_HOST`);
    return;
  }
  const redis = new IORedis(
    +process.env.TEST_REDIS_PORT!,
    process.env.TEST_REDIS_HOST!
  );
  try {
    await cb(redis);
  } finally {
    redis.disconnect();
  }
};

export const testRedis = (
  name: string,
  cb: (redis: IORedis.Redis) => Promise<any>
) => {
  if (isRedisNotSupported()) {
    // A dummy test to ignore jest errors.
    test(name, () => expect(true).toEqual(true));
    return;
  }
  test(name, async () => {
    await redisWork(cb);
  });
};
