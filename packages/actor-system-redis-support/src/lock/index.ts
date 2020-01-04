import ILockRelease from "@yingyeothon/actor-system/lib/lock/release";
import ILockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import tryAcquire from "./acquire";
import release from "./release";

interface IRedisLockArguments {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
  lockTimeout?: number;
}

export class RedisLock implements ILockAcquire, ILockRelease {
  public tryAcquire: (actorId: string) => Promise<boolean>;
  public release: (actorId: string) => Promise<boolean>;

  constructor(args: IRedisLockArguments) {
    const awaiter = { ...tryAcquire(args), ...release(args) };
    for (const key of Object.keys(awaiter)) {
      this[key] = awaiter[key];
    }
  }
}
