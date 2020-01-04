import IQueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { ICodec } from "@yingyeothon/codec";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function pop({ connection, keyPrefix, codec, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    codec?: ICodec<string>;
    logger?: ILogger;
}): IQueueSingleConsumer;
