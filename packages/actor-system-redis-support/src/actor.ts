import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { RedisAwaiter } from "./awaiter";
import { RedisLock } from "./lock";
import { RedisQueue } from "./queue";

interface IRedisOptions {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
}

export const newRedisSubsystem = ({
  connection,
  keyPrefix = "",
  logger = nullLogger
}: IRedisOptions) => ({
  queue: new RedisQueue({
    connection,
    keyPrefix: keyPrefix + "queue:",
    logger
  }),
  lock: new RedisLock({ connection, keyPrefix: keyPrefix + "lock:", logger }),
  awaiter: new RedisAwaiter({
    connection,
    keyPrefix: keyPrefix + "awaiter:",
    logger
  })
});
