import { ConsoleLogger } from "@yingyeothon/logger";
import { testRedis } from ".";
import { RedisQueue } from "..";

interface IKeyValue {
  key: string;
  value: string;
}

testRedis("queue", async redis => {
  const queue = new RedisQueue({ redis, logger: new ConsoleLogger(`debug`) });
  const actorId = "test-actor";

  expect(await queue.size(actorId)).toBe(0);
  expect(await queue.peek(actorId)).toBe(null);
  expect(await queue.pop(actorId)).toBe(null);

  const tuple1: IKeyValue = { key: "hello", value: "world" };
  const tuple2: IKeyValue = { key: "hi", value: "there" };

  await queue.push(actorId, tuple1);
  expect(await queue.size(actorId)).toBe(1);
  expect(await queue.peek(actorId)).toEqual(tuple1);

  await queue.push(actorId, tuple2);
  expect(await queue.size(actorId)).toBe(2);
  expect(await queue.peek(actorId)).toEqual(tuple1);

  expect(await queue.pop(actorId)).toEqual(tuple1);
  expect(await queue.size(actorId)).toBe(1);
  expect(await queue.peek(actorId)).toEqual(tuple2);

  expect(await queue.pop(actorId)).toEqual(tuple2);
  expect(await queue.size(actorId)).toBe(0);
  expect(await queue.peek(actorId)).toBe(null);
});
