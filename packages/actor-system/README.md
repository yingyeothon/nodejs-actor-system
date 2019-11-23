# Actor system

A basic actor system only using a queue and a lock.

## Usage

```typescript
import {
  ActorSystem,
  InMemoryLock,
  InMemoryQueue
} from "@yingyeothon/actor-system";

const sys = new ActorSystem({
  queue: new InMemoryQueue(),
  lock: new InMemoryLock()
});

interface IModifier {
  action: "set" | "add";
  value: number;
}

interface IContext {
  value: number;
}

const context: { [actorName: string]: IContext } = {};

const adder = sys.spawn<IModifier>("adder-1", newActor =>
  newActor
    .on("spawn", ({ name }) => {
      context[name] = { value: 0 };
    })
    .on("act", ({ name, message: { action, value } }) => {
      switch (action) {
        case "set":
          context[name].value = value;
          break;
        case "add":
          context[name].value += value;
          break;
      }
    })
    .on("despawn", ({ name }) => {
      delete context[name];
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

// "adder" actor would process all messages sequentially in background
// with its "spawn" and "despawn" message.
```

Preventing to be a victim, it supports a `shiftTimeout` when processing messages from a queue. If a timeout occurred while executing `tryToProcess`, it gives up to process and occurs `shift` event. It is useful to use in a container which has a limited lifetime such as AWS Lambda.

```typescript
const adder = sys.spawn<IModifier>("disposable-adder", newActor =>
  newActor.on("shift", ({ name }) => {
    // Invoke new AWS Lambda for this actor.
  })
);

const postAdd = async (mod: IModifier) => {
  await adder.post(mod);
  await adder.tryToProcess({
    shiftTimeout: 6 * 1000 // A usual timeout of API Gateway
  });
};
```

If a queue and a lock would support distributed, it will be a distributed actor system. But in that situation, `spawn` and `despawn` can be occurred in every container which is disposable and newly creatable so please be careful these messages with `shift` actors.

## License

MIT
