import IQueueLength from "@yingyeothon/actor-system/lib/queue/length";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function size({ connection, keyPrefix, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
}): IQueueLength;
