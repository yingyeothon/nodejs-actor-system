import { Codec } from "@yingyeothon/codec";
import { LogWriter } from "@yingyeothon/logger";
import QueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import QueueLength from "@yingyeothon/actor-system/lib/queue/length";
import QueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import QueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface RedisQueueArguments {
    connection: RedisConnection;
    keyPrefix?: string;
    codec?: Codec<string>;
    logger?: LogWriter;
}
export declare class RedisQueue implements QueueLength, QueueProducer, QueueSingleConsumer, QueueBulkConsumer {
    readonly size: (actorId: string) => Promise<number>;
    readonly push: <T>(actorId: string, item: T) => Promise<void>;
    readonly pop: <T>(actorId: string) => Promise<T | null>;
    readonly peek: <T>(actorId: string) => Promise<T | null>;
    readonly flush: <T>(actorId: string) => Promise<T[]>;
    constructor(args: RedisQueueArguments);
}
export {};
