import LockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import LockRelease from "@yingyeothon/actor-system/lib/lock/release";
import { LogWriter } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import release from "./release";
import tryAcquire from "./acquire";

interface RedisLockArguments {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
  lockTimeout?: number;
}

export class RedisLock implements LockAcquire, LockRelease {
  public tryAcquire: (actorId: string) => Promise<boolean>;
  public release: (actorId: string) => Promise<boolean>;

  constructor(args: RedisLockArguments) {
    const awaiter = { ...tryAcquire(args), ...release(args) };
    for (const key of Object.keys(awaiter)) {
      this[key] = awaiter[key];
    }
  }
}
