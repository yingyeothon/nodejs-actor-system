import * as Actor from "@yingyeothon/actor-system";
import * as InMemorySupport from "@yingyeothon/actor-system/lib/support/inmemory";

import { ConsoleLogger } from "@yingyeothon/logger";
import { handleActorAPIEvent } from "../lib";

class Adder {
  public value = 0;
  public state: undefined | "prepared" | "committed";

  constructor(public readonly id: string) {}

  public onPrepare = () => (this.state = "prepared");
  public onCommit = () => (this.state = "committed");
  public onMessage = (message: { delta: number }) =>
    (this.value += message.delta);
}

const actorSubsys = {
  queue: new InMemorySupport.InMemoryQueue(),
  lock: new InMemorySupport.InMemoryLock(),
  awaiter: new InMemorySupport.InMemoryAwaiter(),
  logger: new ConsoleLogger(`debug`),
};

test("send", async () => {
  const adder = new Adder("adder");
  const enqueueEnv = { id: adder.id, queue: { push: actorSubsys.queue.push } };
  const handle = handleActorAPIEvent({
    newActorEnv: () => ({
      ...Actor.singleConsumer,
      ...actorSubsys,
      ...adder,
    }),
    policy: {
      type: "send",
    },
  });

  Actor.enqueue(enqueueEnv, { item: { delta: 1 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 2 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 3 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 4 } });

  await handle(
    { path: "/actor-id", body: JSON.stringify({ delta: 32 }) } as any,
    {} as any,
    {} as any
  );
  // "send" can process messages in Q.
  expect(adder.value).toEqual(42);

  Actor.enqueue(enqueueEnv, { item: { delta: 5 } });

  await handle(
    { path: "/actor-id", body: JSON.stringify({ delta: 5 }) } as any,
    {} as any,
    {} as any
  );
  expect(adder.value).toEqual(52);
});

test("post", async () => {
  const adder = new Adder("adder");
  const enqueueEnv = { id: adder.id, queue: { push: actorSubsys.queue.push } };
  const handle = handleActorAPIEvent({
    newActorEnv: () => ({
      ...Actor.singleConsumer,
      ...actorSubsys,
      ...adder,
    }),
    policy: {
      type: "post",
    },
  });

  Actor.enqueue(enqueueEnv, { item: { delta: 1 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 2 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 3 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 4 } });

  await handle(
    { path: "/actor-id", body: JSON.stringify({ delta: 32 }) } as any,
    {} as any,
    {} as any
  );

  // "post" does not process messages in Q.
  expect(adder.value).toEqual(0);
});
