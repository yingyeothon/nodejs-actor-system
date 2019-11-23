import { IAwaiter } from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";
interface IRedisAwaiterArguments {
    redis?: IORedis.Redis;
    keyPrefix?: string;
    logger?: ILogger;
}
export declare class RedisAwaiter implements IAwaiter {
    private readonly redis;
    private readonly keyPrefix;
    private readonly logger;
    constructor({ redis, keyPrefix, logger }?: IRedisAwaiterArguments);
    wait(actorId: string, messageId: string, timeoutMillis: number): Promise<boolean>;
    resolve(actorId: string, messageId: string): Promise<void>;
    private asRedisKey;
}
export {};
