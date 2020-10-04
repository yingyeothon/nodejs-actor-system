import AwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import AwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { LogWriter } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import resolve from "./resolve";
import wait from "./wait";

interface RedisAwaiterArguments {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
}

export class RedisAwaiter implements AwaiterResolve, AwaiterWait {
  public wait: (
    actorId: string,
    messageId: string,
    timeoutMillis: number
  ) => Promise<boolean>;
  public resolve: (actorId: string, messageId: string) => Promise<void>;

  constructor(args: RedisAwaiterArguments) {
    const awaiter = { ...wait(args), ...resolve(args) };
    for (const key of Object.keys(awaiter)) {
      this[key] = awaiter[key];
    }
  }
}
