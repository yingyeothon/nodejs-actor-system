import * as Actor from "../src";

import { InMemoryLock, InMemoryQueue } from "../src/support/inmemory";

import { ConsoleLogger } from "@yingyeothon/logger";

interface AdderMessage {
  delta: number;
}

class AdderLoop {
  public value = 0;

  public loop = async (poll: () => Promise<AdderMessage[]>) => {
    const messages = await poll();
    for (const { delta } of messages) {
      this.value += delta;
    }
  };
}

const sharedEnv = {
  id: `loop-1`,
  queue: new InMemoryQueue(),
  lock: new InMemoryLock(),
  logger: new ConsoleLogger(`debug`),
};

test("eventLoop-simple", async () => {
  const loop = new AdderLoop();
  await Actor.eventLoop<AdderMessage>({
    ...sharedEnv,
    ...loop,
  });
  expect(loop.value).toEqual(0);

  for (let delta = 1; delta <= 10; delta++) {
    await Actor.enqueue<AdderMessage>(sharedEnv, {
      item: { delta },
    });
  }
  await Actor.eventLoop<AdderMessage>({
    ...sharedEnv,
    ...loop,
  });
  expect(loop.value).toEqual(55);

  for (let delta = 1; delta <= 10; delta++) {
    await Actor.enqueue<AdderMessage>(sharedEnv, {
      item: { delta },
    });
  }
  await Actor.eventLoop<AdderMessage>({
    ...sharedEnv,
    ...loop,
  });
  expect(loop.value).toEqual(110);
});
