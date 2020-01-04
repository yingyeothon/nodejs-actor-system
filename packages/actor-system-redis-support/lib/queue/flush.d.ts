import IQueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import { ICodec } from "@yingyeothon/codec";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function flush({ connection, keyPrefix, codec, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    codec?: ICodec<string>;
    logger?: ILogger;
}): IQueueBulkConsumer;
