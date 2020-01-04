import IAwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function resolve({ connection, keyPrefix, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
}): IAwaiterResolve;
