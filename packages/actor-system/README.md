# Actor system

A basic actor system only using a queue and a lock.

## Usage

### The simplest case

```typescript
import * as Actor from "@yingyeothon/actor-system";
import * as InMemorySupport from "@yingyeothon/actor-system/lib/support/inmemory";

const subsys = {
  queue: new InMemorySupport.InMemoryQueue(),
  lock: new InMemorySupport.InMemoryLock(),
  awaiter: new InMemorySupport.InMemoryAwaiter()
};

class Adder {
  private value = 0;

  constructor(public readonly id: string) {}

  public onMessage = (message: { delta: number }) => {
    this.value += message.delta;
  };
}

const env = { ...Actor.singleConsumer, ...subsys, ...new Adder(`adder-1`) };

// `send` means that produces a message to an actor and try to process it if it is possible.
// If other thread attaches this actor, it would process my message, too.
await Actor.send(env, { item: { delta: 1 } });
await Actor.send(env, { item: { delta: 2 } });
await Actor.send(env, { item: { delta: 3 } });
await Actor.send(env, { item: { delta: 4 } });

// `adder` actor would process all messages sequentially in background.
```

### Await policy

It supports `awaitPolicy` that determines how long I should wait. `Forget` is default that means I don't want to wait anymore. We can choose `Act` that waits after `onMesssage` call or `Commit` that waits after `onCommit` call. And in that cases, `awaitTimeoutMillis` makes a timeout to wait.

```typescript
Actor.send(env, {
  item: { delta: 10 },
  awaitPolicy: Actor.AwaitPolicy.Act,
  awaitTimeoutMillis: 100
})
  .then(/* HAPPY */) // It would be called after `onMessage`.
  .catch(/* SAD */);
```

### With prepare and commit

It is too hard that an actor loads its context everytime to process `onMessage`. If there are many of waiting messages it leads to huge latency. To overcome this, this library supports `onPrepare` and `onCommit` to make a processing cycle like `onPrepare -> a loop of onMessage until a queue is empty -> onCommit`.

```typescript
class Adder {
  private value = 0;

  constructor(public readonly id: string) {}

  public onPrepare = async () => {
    // Load context from the outer storage.
  };
  public onCommit = () => {
    // Store context to the outer storage.
  };

  public onMessage = (message: { delta: number }) => {
    // Modify context in memory.
    this.value += message.delta;
  };
}

const env = { ...Actor.singleConsumer, ...subsys, ...new Adder(`adder-1`) };
Actor.send(env, {
  item: { delta: 10 },
  awaitPolicy: Actor.AwaitPolicy.Commit,
  awaitTimeoutMillis: 1000
})
  .then(/* HAPPY */) // It would be called after `onCommit`.
  .catch(/* SAD */);
```

### With fire-and-forget producer and dedicated consumer

Sometimes, we want to use fire-and-forget producer and dedicated consumer to improve overall latency. And, in this case, _bulk-message-handler_ is better than _single-message-handler_.

```typescript
// To reduce code size, use an environment tailored to `post`.
await Actor.post(
  {
    id: `adder-1`,
    awaiter: {
      wait: subsys.awaiter.wait
    },
    queue: {
      push: subsys.queue.push
    },
    logger: subsys.logger // optional
  },
  { item: { delta: 10 } }
)
  .then(/* HAPPY */)
  .catch(/* SAD */);

// Or you can use `enqueue`, which doesn't even need `awaiter`.
Actor.enqueue(
  {
    id: adder.id,
    queue: {
      push: actorSubsys.queue.push
    },
    logger: actorSubsys.logger // optional
  },
  { item: { delta: 1 } }
)
  .then(/* HAPPY */)
  .catch(/* SAD */);
```

```typescript
class Adder {
  private value = 0;

  constructor(public readonly id: string) {}

  // It can process multiple messages at one time.
  public onMessages = (messages: Array<{ delta: number }>) => {
    for (const message of messages) {
      this.value += message.delta;
    }
  };
}

// This `bulk` processor would be alive in 60 seconds.
const env = { ...Actor.bulkConsumer, ...subsys, ...new Adder(`adder-1`) };
Actor.tryToProcess(env, { aliveMillis: 60 * 1000 });
```

### Shift

Preventing to be a victim, it supports `aliveMillis` and `shiftable` when processing messages from a queue. If a timeout occurred while executing `tryToProcess`, it gives up to process and occurs `shift` event. It is useful to use in a container which has a limited lifetime such as AWS Lambda.

```typescript
const subsysWithShift = {
  ...subsys,
  shift: async (actorId: string) => {
    // Invoke a new AWS Lambda to process remaining messages in this actor.
  }
};

const env = { ...Actor.singleConsumer, ...subsys, ...new Adder(`adder-shift`) };
Actor.send(
  env,
  {
    item: { delta: 10 }
  },
  { aliveMillis: 5 * 1000, shiftable: true } // A usual timeout of API Gateway
);
```

It can be expanded a distributed actor system easily when both of a queue and a lock work properly in shared instances.

## License

MIT
