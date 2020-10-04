import * as Actor from "../src";

import {
  InMemoryAwaiter,
  InMemoryLock,
  InMemoryQueue,
} from "../src/support/inmemory";

import { ConsoleLogger } from "@yingyeothon/logger";

interface IAdderMessage {
  delta: number;
}

const actorSubsys = {
  queue: new InMemoryQueue(),
  lock: new InMemoryLock(),
  awaiter: new InMemoryAwaiter(),
  logger: new ConsoleLogger(`debug`),
};

class Adder {
  public value = 0;

  constructor(public readonly id: string) {}

  public onMessages = (messages: IAdderMessage[]) => {
    for (const { delta } of messages) {
      this.value += delta;
    }
  };
}

test("adder-simple", async () => {
  const adder = new Adder("adder");
  const env = { ...Actor.bulkConsumer, ...actorSubsys, ...adder };

  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.value).toEqual(0);

  await Actor.tryToProcess(env);
  expect(adder.value).toEqual(3);

  await Actor.tryToProcess(env);
  expect(adder.value).toEqual(3);
});
