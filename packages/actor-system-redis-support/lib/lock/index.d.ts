import ILockRelease from "@yingyeothon/actor-system/lib/lock/release";
import ILockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface IRedisLockArguments {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
    lockTimeout?: number;
}
export declare class RedisLock implements ILockAcquire, ILockRelease {
    tryAcquire: (actorId: string) => Promise<boolean>;
    release: (actorId: string) => Promise<boolean>;
    constructor(args: IRedisLockArguments);
}
export {};
