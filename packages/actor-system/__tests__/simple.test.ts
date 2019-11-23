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

class Adder {
  public value: number = 0;
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
  const env = withInMemoryActor(adder);

  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.post(env, { item: { delta: 1 } });
  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.consumeUntil(env, { untilMillis: 0 });
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);

  await Actor.consumeUntil(env, { untilMillis: 0 });
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);
});
