import { LogWriter } from "@yingyeothon/logger";
import ILockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function tryAcquire({ connection, keyPrefix, logger, lockTimeout, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
    lockTimeout?: number;
}): ILockAcquire;
