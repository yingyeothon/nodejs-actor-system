import * as Actor from "@yingyeothon/actor-system";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";
import { RedisAwaiter } from "./awaiter";
import { RedisLock } from "./lock";
import { RedisQueue } from "./queue";

interface IRedisOptions {
  redis?: IORedis.Redis;
  keyPrefix?: string;
  logger?: ILogger;
}

export const newRedisSubsystem = ({
  redis = new IORedis(),
  keyPrefix = "",
  logger = nullLogger
}: IRedisOptions): Pick<
  Actor.IActorSubsystem,
  "queue" | "lock" | "awaiter"
> => ({
  queue: new RedisQueue({ redis, keyPrefix: keyPrefix + "queue:", logger }),
  lock: new RedisLock({ redis, keyPrefix: keyPrefix + "lock:", logger }),
  awaiter: new RedisAwaiter({
    redis,
    keyPrefix: keyPrefix + "awaiter:",
    logger
  })
});
