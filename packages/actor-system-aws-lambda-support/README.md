# AWS Lambda support for Actor system

The AWS Lambda support for `actor-system`.

- A simple `AWS APIGateway` handler of `APIGatewayProxyEvent` that has a message in its `body` payload to serve an actor's request.
- A simple `AWS Lambda` handler with a `ActorLambdaEvent` that has the id of actor to process remaining messages in its queue.

## Usage

```typescript
import * as Actor from "@yingyeothon/actor-system";
import {
  shiftToNextLambda,
  handleActorAPIEvent,
  handleActorLambdaEvent
} from "@yingyeothon/actor-system-aws-lambda-support";
import * as RedisSupport from "@yingyeothon/actor-system-redis-support";
import { RedisRepository } from "@yingyeothon/repository-redis";
import * as IORedis from "ioredis";

// Define subsystems for Actor
const redis = new IORedis();
const subsys: Actor.IActorSubsystem = {
  queue: new RedisSupport.RedisQueue({ redis }),
  lock: new RedisSupport.RedisLock({ redis }),
  awaiter: new RedisSupport.RedisAwaiter({ redis }),
  shift: shiftToNextLambda({
    functionName: process.env.BOTTOM_HALF_LAMBDA!
  })
};

// Define a context and handlers for Actor
const repo = new RedisRepository({ redis });
class Adder {
  private value = 0;

  constructor(public readonly id: string) {}

  public onPrepare = async () =>
    (this.value = (await repo.get<number>(`value:${this.id}`)) || 0);

  public onCommit = async () => repo.set(`value:${this.id}`, this.value);

  public onMessage = async (message: { delta: number }) => {
    this.value += message.delta;
  };
}

// This is a function to build a new actor from its id.
const newActor = (actorId: string) => Actor.newEnv(subsys)(new Adder(actorId));

// To receive a message via API Gateway
// and process it as possible as it can like top-half.
export const sendActorMessage = handleActorAPIEvent({
  newActorEnv: apiPath => newActor(apiPath),
  policy: {
    // This handler will try to process the message as soon as it sends to the actor.
    type: "send",

    // Wait up to 2 seconds for the message to be processed and committed.
    messageMeta: {
      awaitPolicy: Actor.AwaitPolicy.Commit,
      awaitTimeoutMillis: 2 * 1000
    },

    /*
     * If the message can be processed, processing is performed for up to 500 ms.
     * However, if all messages have been processed before then, exit immediately,
     * otherwise start bottomHalf by firing a shift event.
     */
    processOptions: {
      aliveMillis: 500,
      oneShot: true,
      shiftable: true
    }
  }
});

// To process remaining messages in Lambda that invoked
// by other lifetime-exhausted Lambda or Lambda Proxy.
export const processBottomHalf = handleActorLambdaEvent<IActorLambdaEvent>({
  newActorEnv: ({ actorId }) => newActor(actorId),

  /*
   * The fact that this function is executed is that the request volume is high
   * and the API handlers cannot process the message. So let's set it up to handle
   * messages for as long as 30 seconds, for example.
   */
  processOptions: {
    aliveMillis: 30 * 1000,
    oneShot: false,
    shiftable: true
  }
});
```

And then, expose

- `sendActorMessage` as a Lambda proxy of API Gateway,
- `processBottomHalf` as a Lambda function to process remaining messages that cannot be processed from API handlers which is short-lived.
