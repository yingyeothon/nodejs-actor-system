# Redis support for Actor system

The queue and lock implementation using Redis to support `actor-system`.

## Usage

Using Redis-based queue and lock instead of In-memory-based one, it can support the actor system in distributed mode. And of course, please keep a state of an actor using a proper repository such as `Redis` or `AWS S3`.

### With single consumer

```typescript
import * as Actor from "@yingyeothon/actor-system";
import * as RedisSupport from "@yingyeothon/actor-system-redis-support";
import { RedisRepository } from "@yingyeothon/repository-redis";
import connect, {
  IRedisConnection
} from "@yingyeothon/naive-redis/lib/connect";
-import * as IORedis from "ioredis";

const connection = connect({
  host: `my.redis.domain`,
  port: 6379,
  password: `very-secret`,
  timeoutMillis: 1000
});

const subsys: Actor.IActorSubsystem = {
  queue: new RedisSupport.RedisQueue({ connection }),
  lock: new RedisSupport.RedisLock({ connection }),
  awaiter: new RedisSupport.RedisAwaiter({ connection })
};

// Keep a state using Redis.
const redis = new IORedis();
const repo = new RedisRepository({ redis, prefix: "adder:" });
class Adder {
  private value = 0;

  constructor(public readonly id: string) {}

  // Load a state from Redis.
  public onPrepare = async () =>
    (this.value = (await repo.get<number>(`value:${this.id}`)) || 0);

  // Store the updated context to Redis after acted.
  public onCommit = async () => repo.set(`value:${this.id}`, this.value);

  public onMessage = (message: { delta: number }) => {
    this.value += message.delta;
    console.log(`new value is ${this.value}`);
  };
}

const env = { ...Actor.singleConsumer, ...subsys, ...new Adder(`adder-1`) };
Actor.send(env, { item: { delta: 100 } });
Actor.send(env, { item: { delta: 200 } });
Actor.send(env, { item: { delta: -500 } });
```

### With bulk consumer

It can be rewritten using a bulk way.

```typescript
class Adder {
  constructor(public readonly id: string) {}

  public onMessages = async (messages: { delta: number }[]) => {
    // Load a state from Redis.
    let value = (await repo.get<number>(`value:${this.id}`)) || 0;

    // Process all messages in this actor's queue.
    for (const message of messages) {
      value += message.delta;
    }

    // Store the updated context to Redis after acted.
    await repo.set(`value:${this.id}`, value);
  };
}

const env = { ...Actor.bulkConsumer, ...subsys, ...new Adder(`adder-1`) };
Actor.send(env, { item: { delta: 100 } });
Actor.send(env, { item: { delta: 200 } });
Actor.send(env, { item: { delta: -500 } });
```

### With dedicated consumer

We can think it is too tough that loads and stores a state from Redis in everytime. If we can use a dedicated consumer, we can write more efficient system like this.

```typescript
class Adder {
  private value = 0;

  constructor(public readonly id: string) {}

  public load = async () =>
    (this.value = (await repo.get<number>(`value:${this.id}`)) || 0);

  public store = async () => repo.set(`value:${this.id}`, this.value);

  public onMessages = async (messages: { delta: number }[]) => {
    // Process all messages in this actor's queue.
    for (const message of messages) {
      this.value += message.delta;
    }
  };
}

// In consumer context
const processActor = async (actorId: string) => {
  const adder = new Adder(actorId);
  const env = Actor.newBulkEnv(subsys)(adder);
  await adder.load();
  await Actor.tryToProcess(env, { aliveMillis: 60 * 1000 });
  await adder.store();
};
await processActor(`adder-1`);

// In producer context
await Actor.post({ ...subsys, id: `adder-1` }, { item: { delta: 100 } });
```

If we want to minimize the code size of producer, we can use like this.

```typescript
import actorEnqueue from "@yingyeothon/actor-system/lib/actor/enqueue";
import redisConnect from "@yingyeothon/naive-redis/lib/connection";
import redisQueuePush from "@yingyeothon/actor-system-redis-support/lib/queue/push";

const connection = redisConnect({
  host: `my.redis.domain`,
});
await actorEnqueue(
  {
    id: `adder-1`,
    queue: redisQueuePush({ connection }),
  },
  { item: { delta: 1 } }
);
```

## License

MIT
