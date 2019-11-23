import { ConsoleLogger } from "@yingyeothon/logger";
import * as Actor from "../src";
import {
  InMemoryAwaiter,
  InMemoryLock,
  InMemoryQueue
} from "../src/support/inmemory";

interface IAdderMessage {
  delta: number;
}

const withInMemoryActor = Actor.newEnv({
  queue: new InMemoryQueue(),
  lock: new InMemoryLock(),
  awaiter: new InMemoryAwaiter(),
  logger: new ConsoleLogger(`debug`)
});

const ttl = 50;

class Adder {
  public value: number = 0;
  public state: undefined | "prepared" | "committed";

  constructor(public readonly id: string) {}

  public onPrepare = () => (this.state = "prepared");
  public onCommit = () => (this.state = "committed");
  public onMessage = async ({ delta }: IAdderMessage) => {
    this.value += delta;
    await sleep(ttl + 1);
  };
}

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

test("adder-shift", async () => {
  const actor = new Adder("adder");
  const env = withInMemoryActor(actor);

  let shiftCount = 0;
  env.shift = () => ++shiftCount;

  expect(actor.state).toBeUndefined();
  expect(actor.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(actor.state).toBeUndefined();
  expect(actor.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(actor.state).toBeUndefined();
  expect(actor.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(actor.state).toBeUndefined();
  expect(actor.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await Actor.tryToProcess(env, {
    shiftTimeout: ttl
  });
  expect(actor.state).toEqual("committed");
  expect(actor.value).toEqual(1);
  expect(shiftCount).toEqual(1);

  await Actor.tryToProcess(env, {
    shiftTimeout: ttl
  });
  expect(actor.state).toEqual("committed");
  expect(actor.value).toEqual(2);
  expect(shiftCount).toEqual(2);

  await Actor.tryToProcess(env, {
    shiftTimeout: ttl
  });
  expect(actor.state).toEqual("committed");
  expect(actor.value).toEqual(3);

  // No shift because there is no more messages.
  expect(shiftCount).toEqual(2);
});
