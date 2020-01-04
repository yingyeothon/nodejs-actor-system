import IQueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import { ICodec } from "@yingyeothon/codec";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function push({ connection, keyPrefix, codec, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    codec?: ICodec<string>;
    logger?: ILogger;
}): IQueueProducer;
