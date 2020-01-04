import IQueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import IQueueLength from "@yingyeothon/actor-system/lib/queue/length";
import IQueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import IQueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { ICodec } from "@yingyeothon/codec";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface IRedisQueueArguments {
    connection: IRedisConnection;
    keyPrefix?: string;
    codec?: ICodec<string>;
    logger?: ILogger;
}
export declare class RedisQueue implements IQueueLength, IQueueProducer, IQueueSingleConsumer, IQueueBulkConsumer {
    readonly size: (actorId: string) => Promise<number>;
    readonly push: <T>(actorId: string, item: T) => Promise<void>;
    readonly pop: <T>(actorId: string) => Promise<T | null>;
    readonly peek: <T>(actorId: string) => Promise<T | null>;
    readonly flush: <T>(actorId: string) => Promise<T[]>;
    constructor(args: IRedisQueueArguments);
}
export {};
