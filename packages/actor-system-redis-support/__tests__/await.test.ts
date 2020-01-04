import * as Actor from "@yingyeothon/actor-system";
import { ConsoleLogger } from "@yingyeothon/logger";
import { testRedis } from ".";
import { newRedisSubsystem } from "../src";

interface IAdderMessage {
  delta: number;
}

class Adder {
  public value: number = 0;
  public state: undefined | "prepared" | "committed";

  constructor(public readonly id: string) {}

  public onPrepare = () => (this.state = "prepared");
  public onCommit = () => (this.state = "committed");
  public onMessage = (message: IAdderMessage) => (this.value += message.delta);
}

testRedis("adder-await", async connection => {
  const adder = new Adder("adder");
  const env = {
    ...Actor.singleConsumer,
    ...newRedisSubsystem({
      connection,
      keyPrefix: "__TEST__await__",
      logger: new ConsoleLogger(`debug`)
    }),
    ...adder
  };

  expect(adder.state).toBeUndefined();
  expect(adder.value).toEqual(0);

  await Actor.send(env, {
    item: { delta: 1 },
    awaitPolicy: Actor.AwaitPolicy.Commit
  });
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(1);

  await Actor.send(env, {
    item: { delta: 1 },
    awaitPolicy: Actor.AwaitPolicy.Commit
  });
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(2);

  const orderSet: string[] = [];
  setTimeout(async () => {
    orderSet.push("first");
    console.log(`reach the first`);
    await Actor.tryToProcess(env, { oneShot: true });
  }, 50);

  const wait = await Actor.post(env, {
    item: { delta: 1 },
    awaitPolicy: Actor.AwaitPolicy.Commit,
    awaitTimeoutMillis: 200
  });
  console.log(`after post`);
  expect(wait).toBe(true);

  orderSet.push("second");
  console.log(`reach the second`);
  expect(adder.state).toEqual("committed");
  expect(adder.value).toEqual(3);
  expect(orderSet).toEqual(["first", "second"]);
});
