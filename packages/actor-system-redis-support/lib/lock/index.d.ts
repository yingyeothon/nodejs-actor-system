import LockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import LockRelease from "@yingyeothon/actor-system/lib/lock/release";
import { LogWriter } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface RedisLockArguments {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
    lockTimeout?: number;
}
export declare class RedisLock implements LockAcquire, LockRelease {
    tryAcquire: (actorId: string) => Promise<boolean>;
    release: (actorId: string) => Promise<boolean>;
    constructor(args: RedisLockArguments);
}
export {};
