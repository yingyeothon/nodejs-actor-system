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
  public state: undefined | "prepared" | "committed";

  constructor(public readonly id: string) {}

  public onPrepare = () => (this.state = "prepared");
  public onCommit = () => (this.state = "committed");
  public onMessage = ({ delta }: IAdderMessage) => {
    this.value += delta;
  };
}

test("adder-simple", async () => {
  const adder = new Adder("adder");
  const env = { ...Actor.singleConsumer, ...actorSubsys, ...adder };
  const enqueueEnv = { id: adder.id, queue: { push: actorSubsys.queue.push } };

  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  // It is actually same with `post` call without awaiting.
  await Actor.enqueue(enqueueEnv, { item: { delta: 1 } });
  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.tryToProcess(env);
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);

  await Actor.tryToProcess(env);
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);
});
