import ILockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function tryAcquire({ connection, keyPrefix, logger, lockTimeout }: {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
    lockTimeout?: number;
}): ILockAcquire;
