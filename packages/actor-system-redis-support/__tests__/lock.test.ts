import { ConsoleLogger } from "@yingyeothon/logger";
import { testRedis } from ".";
import { RedisLock } from "..";

testRedis("lock", async redis => {
  const lock = new RedisLock({ redis, logger: new ConsoleLogger(`debug`) });
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
