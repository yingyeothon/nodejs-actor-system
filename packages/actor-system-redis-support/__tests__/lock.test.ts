import { ConsoleLogger } from "@yingyeothon/logger";
import { RedisLock } from "..";
import { testRedis } from ".";

testRedis("lock", async (connection) => {
  const lock = new RedisLock({
    connection,
    logger: new ConsoleLogger(`debug`),
  });
  const actorId = "test-actor";
  await lock.release(actorId);

  expect(await lock.tryAcquire(actorId)).toBe(true);
  expect(await lock.tryAcquire(actorId)).toBe(false);
  expect(await lock.tryAcquire(actorId)).toBe(false);

  expect(await lock.release(actorId)).toBe(true);
  expect(await lock.tryAcquire(actorId)).toBe(true);
  expect(await lock.tryAcquire(actorId)).toBe(false);
  expect(await lock.release(actorId)).toBe(true);
});
