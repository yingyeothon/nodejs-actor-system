import * as Actor from "@yingyeothon/actor-system";

import { ConsoleLogger } from "@yingyeothon/logger";
import { newRedisSubsystem } from "../src";
import { testRedis } from ".";

interface IAdderMessage {
  delta: number;
}

class Adder {
  public value = 0;
  public state: undefined | "prepared" | "committed";

  constructor(public readonly id: string) {}

  public onPrepare = () => (this.state = "prepared");
  public onCommit = () => (this.state = "committed");
  public onMessage = (message: IAdderMessage) => (this.value += message.delta);
}

testRedis("simple-actor", async (connection) => {
  const adder = new Adder("adder");
  const env = {
    ...Actor.singleConsumer,
    ...newRedisSubsystem({
      connection,
      keyPrefix: "__TEST__simple__",
      logger: new ConsoleLogger(`debug`),
    }),
    ...adder,
  };

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

  await Actor.tryToProcess(env);
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);
});
