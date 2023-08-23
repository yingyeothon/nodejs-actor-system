import * as Actor from "@yingyeothon/actor-system";
import * as InMemorySupport from "@yingyeothon/actor-system/lib/support/inmemory";

import { ConsoleLogger } from "@yingyeothon/logger";
import { handleActorLambdaEvent } from "../lib";

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

test("process", async () => {
  const adder = new Adder("adder");
  const enqueueEnv = { id: adder.id, queue: { push: actorSubsys.queue.push } };
  const handle = handleActorLambdaEvent({
    newActorEnv: () => ({ ...Actor.singleConsumer, ...actorSubsys, ...adder }),
  });

  Actor.enqueue(enqueueEnv, { item: { delta: 1 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 2 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 3 } });
  Actor.enqueue(enqueueEnv, { item: { delta: 4 } });

  await handle({ actorId: adder.id }, {} as any, {} as any);
  expect(adder.value).toEqual(10);

  Actor.enqueue(enqueueEnv, { item: { delta: 5 } });

  await handle({ actorId: adder.id }, {} as any, {} as any);
  expect(adder.value).toEqual(15);
});
