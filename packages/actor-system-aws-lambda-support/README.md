# AWS Lambda support for Actor system

The AWS Lambda support for `actor-system`.

- A simple `AWS APIGateway` handler of `APIGatewayProxyEvent` that has a message in its `body` payload to serve an actor's request.
- A simple `AWS Lambda` handler with a `ActorLambdaEvent` that has the name of actor to process remaining messages in its queue.

## Usage

```typescript
import { ActorSystem } from "@yingyeothon/actor-system";
import {
  handleActorAPIEvent,
  handleActorLambdaEvent,
  shiftToNextLambda
} from "@yingyeothon/actor-system-aws-lambda-support";

const sys = new ActorSystem(/* constructors */);
const spawn = (name: string) =>
  sys.spawn<IMessage>("my-actor", newActor =>
    newActor
      .on("act", async message => {
        /* message handler */
      })
      .on(
        "shift",
        shiftToNextLambda({
          functionName: process.env.BOTTOM_HALF_LAMBDA
        })
      )
  );

// To receive a message via API Gateway
// and process it as possible as it can like top-half.
export const postActorMessage = handleActorAPIEvent({
  spawn
  // Default parameters:
  // parseMessage: JSON.parse,
  // functionTimeout: 6 * 1000,
  // logger: new ConsoleLogger(),
});

// To process remaining messages in Lambda that invoked
// by other lifetime-exhausted Lambda or Lambda Proxy.
export const processBottomHalf = handleActorLambdaEvent({
  spawn
  // Default parameters:
  // functionTimeout: 14 * 60 * 1000,
  // logger: new ConsoleLogger(),
});
```

And then, expose

- `postActorMessage` as a Lambda proxy of API Gateway,
- `processBottomHalf` as a Lambda function.
