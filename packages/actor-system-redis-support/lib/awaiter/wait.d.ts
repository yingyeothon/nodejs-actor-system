import IAwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function wait({ connection, keyPrefix, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
}): IAwaiterWait;
