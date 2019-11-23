# Redis support for Actor system

The queue and lock implementation using Redis to support `actor-system`.

## Usage

Using Redis-based queue and lock Instead of In-memory-based one, it can support the actor system in distributed mode. And of course, please keep a state of an actor using a proper repository such as `Redis` or `AWS S3`.

```typescript
import { ActorSystem } from "@yingyeothon/actor-system";
import { RedisLock, RedisQueue } from "@yingyeothon/actor-system-redis-support";
import { RedisRepository } from "@yingyeothon/repository-redis";
import * as IORedis from "ioredis";

const redis = new IORedis();
const sys = new ActorSystem({
  queue: new RedisQueue({ redis }),
  lock: new RedisLock({ redis })
});

interface IModifier {
  action: "set" | "add";
  value: number;
}

interface IState {
  value: number;
}

// Keep a state using Redis.
const repo = new RedisRepository({ redis, prefix: "adder:" });
const adder = sys.spawn<IModifier>("adder-1", newActor =>
  newActor.on("act", async ({ name, message: { action, value } }) => {
    // Load a state from Redis.
    const state = await repo.get<IState>(name);
    switch (action) {
      case "set":
        state.value = value;
        break;
      case "add":
        state.value += value;
        break;
    }
    // Store the updated context to Redis after acted.
    await repo.set(name, state);
  })
);

const postAdd = async (mod: IModifier) => {
  await adder.post(mod);
  await adder.tryToProcess();
};

postAdd({ action: "set", value: 100 });
postAdd({ action: "add", value: 10 });
postAdd({ action: "add", value: -20 });
postAdd({ action: "add", value: -20 });
sys.despawn(adder.name);
```

We can think it is too tough that loads and stores a state from Redis in everytime. If we can use error-safe `act`-handler and keep an actor to despawn properly in any circumstances, it can use `spawn` and `despawn` event to write more efficient system.

```typescript
const states: { [actorName: string]: IState } = {};
const adder = sys.spawn<IModifier>("adder-1", newActor =>
  newActor
    .on("spawn", async ({ name }) => {
      // Load a state from Redis and cache it into the in-memory cache.
      // There is no splitted-brain among distributed instances because
      // the actor-system ensures there is the only one actor instance.
      states[name] = await repo.get<IState>(name);
    })
    .on("act", async ({ name, message: { action, value } }) => {
      const state = states[name];
      switch (action) {
        case "set":
          state.value = value;
          break;
        case "add":
          state.value += value;
          break;
      }
    })
    .on("despawn", async ({ name }) => {
      // Store a state to Redis and delete it from the in-memory cache.
      // To store properly, it should be despawned properly via the system object
      // and please be careful any messages received after despawned would be ignored.
      await repo.set(name, states[name]);
      delete states[name];
    })
);
```

The simple scenario that can accept this model is,

- call `spawn` method when a client is _connected_ via a socket such as `WebSocket`,
- post `message`s when a client sends any action messages,
- call `despawn` method when a client is _disconnected_.
- And there is no `shiftTimeout` for this.

## License

MIT
