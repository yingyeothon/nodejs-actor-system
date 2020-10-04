import { LogWriter, nullLogger } from "@yingyeothon/logger";

import { RedisAwaiter } from "./awaiter";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { RedisLock } from "./lock";
import { RedisQueue } from "./queue";

interface RedisOptions {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function newRedisSubsystem({
  connection,
  keyPrefix = "",
  logger = nullLogger,
}: RedisOptions) {
  return {
    queue: new RedisQueue({
      connection,
      keyPrefix: keyPrefix + "queue:",
      logger,
    }),
    lock: new RedisLock({ connection, keyPrefix: keyPrefix + "lock:", logger }),
    awaiter: new RedisAwaiter({
      connection,
      keyPrefix: keyPrefix + "awaiter:",
      logger,
    }),
  };
}
