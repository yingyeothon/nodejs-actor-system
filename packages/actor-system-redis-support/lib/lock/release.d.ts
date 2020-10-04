import { LogWriter } from "@yingyeothon/logger";
import LockRelease from "@yingyeothon/actor-system/lib/lock/release";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function release({ connection, keyPrefix, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
    lockTimeout?: number;
}): LockRelease;
