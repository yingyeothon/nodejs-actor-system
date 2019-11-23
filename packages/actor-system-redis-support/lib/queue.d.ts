import { IQueue } from "@yingyeothon/actor-system";
import { ICodec } from "@yingyeothon/codec";
import { ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";
interface IRedisQueueArguments {
    redis?: IORedis.Redis;
    keyPrefix?: string;
    codec?: ICodec<string>;
    logger?: ILogger;
}
export declare class RedisQueue implements IQueue {
    private readonly redis;
    private readonly keyPrefix;
    private readonly codec;
    private readonly logger;
    constructor({ redis, keyPrefix, codec, logger }?: IRedisQueueArguments);
    size(actorId: string): Promise<number>;
    push<T>(actorId: string, item: T): Promise<void>;
    pop<T>(actorId: string): Promise<T>;
    peek<T>(actorId: string): Promise<T>;
    flush<T>(actorId: string): Promise<T[]>;
    private asRedisKey;
}
export {};
