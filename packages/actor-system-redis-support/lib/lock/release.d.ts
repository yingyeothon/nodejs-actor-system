import ILockRelease from "@yingyeothon/actor-system/lib/lock/release";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function release({ connection, keyPrefix, logger }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
    lockTimeout?: number;
}): ILockRelease;
