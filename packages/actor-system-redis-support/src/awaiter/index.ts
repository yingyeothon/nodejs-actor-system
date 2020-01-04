import IAwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import IAwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import resolve from "./resolve";
import wait from "./wait";

interface IRedisAwaiterArguments {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
}

export class RedisAwaiter implements IAwaiterResolve, IAwaiterWait {
  public wait: (
    actorId: string,
    messageId: string,
    timeoutMillis: number
  ) => Promise<boolean>;
  public resolve: (actorId: string, messageId: string) => Promise<void>;

  constructor(args: IRedisAwaiterArguments) {
    const awaiter = { ...wait(args), ...resolve(args) };
    for (const key of Object.keys(awaiter)) {
      this[key] = awaiter[key];
    }
  }
}
