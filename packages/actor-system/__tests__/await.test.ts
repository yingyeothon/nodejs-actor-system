import * as Actor from "../src";

import {
  InMemoryAwaiter,
  InMemoryLock,
  InMemoryQueue,
} from "../src/support/inmemory";

import { ConsoleLogger } from "@yingyeothon/logger";

interface AdderMessage {
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
  public onMessage = ({ delta }: AdderMessage) => {
    this.value += delta;
  };
}

test("adder-await", async () => {
  const adder = new Adder("adder");
  const env = {
    ...Actor.singleConsumer,
    ...actorSubsys,
    ...adder,
  };

  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.send(env, {
    item: { delta: 1 },
    awaitPolicy: Actor.AwaitPolicy.Commit,
  });
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(1);

  await Actor.send(env, {
    item: { delta: 1 },
    awaitPolicy: Actor.AwaitPolicy.Commit,
  });
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(2);

  const orderSet: string[] = [];
  setTimeout(async () => {
    orderSet.push("first");
    await Actor.tryToProcess(env);
  }, 50);

  await Actor.post(env, {
    item: { delta: 1 },
    awaitPolicy: Actor.AwaitPolicy.Commit,
  });
  orderSet.push("second");
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);
  expect(orderSet).toEqual(["first", "second"]);
});
