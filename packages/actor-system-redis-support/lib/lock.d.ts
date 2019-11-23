import { ILock } from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";
interface IRedisLockArguments {
    redis?: IORedis.Redis;
    keyPrefix?: string;
    logger?: ILogger;
    lockTimeout?: number;
}
export declare class RedisLock implements ILock {
    private static readonly Locked;
    private readonly redis;
    private readonly keyPrefix;
    private readonly logger;
    private readonly lockTimeout;
    constructor({ redis, keyPrefix, logger, lockTimeout }?: IRedisLockArguments);
    tryAcquire(actorId: string): Promise<boolean>;
    release(actorId: string): Promise<boolean>;
    private asRedisKey;
}
export {};
