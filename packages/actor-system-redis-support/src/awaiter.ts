import { IAwaiter } from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";

interface IRedisAwaiterArguments {
  redis?: IORedis.Redis;
  keyPrefix?: string;
  logger?: ILogger;
}

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

const Resolved = "1";
const TimeoutMillisForResolved = 1000;
const SleepIntervalMillisForAwaiting = 50;

export class RedisAwaiter implements IAwaiter {
  private readonly redis: IORedis.Redis;
  private readonly keyPrefix: string;
  private readonly logger: ILogger;

  constructor({ redis, keyPrefix, logger }: IRedisAwaiterArguments = {}) {
    this.redis = redis || new IORedis();
    this.keyPrefix = keyPrefix || "awaiter:";
    this.logger = logger || new ConsoleLogger();
  }

  public async wait(
    actorId: string,
    messageId: string,
    timeoutMillis: number
  ): Promise<boolean> {
    this.logger.debug(`redis-awaiter`, `wait`, messageId, timeoutMillis);
    if (timeoutMillis <= 0) {
      return false;
    }

    const redisKey = this.asRedisKey(actorId, messageId);
    const start = Date.now();
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let remainMillis = 0;
        do {
          const value = await this.redis.get(redisKey);
          remainMillis = start + timeoutMillis - Date.now();

          this.logger.debug(
            `redis-awaiter`,
            `wait`,
            redisKey,
            value,
            remainMillis
          );
          if (value === Resolved) {
            return resolve(true);
          }

          await sleep(Math.min(SleepIntervalMillisForAwaiting, remainMillis));
        } while (remainMillis > 0);
        return resolve(false);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async resolve(actorId: string, messageId: string): Promise<void> {
    const redisKey = this.asRedisKey(actorId, messageId);
    try {
      await this.redis.setex(redisKey, TimeoutMillisForResolved, Resolved);
      this.logger.debug(`redis-awaiter`, `resolve`, redisKey);
    } catch (error) {
      this.logger.debug(`redis-awaiter`, `resolve`, redisKey, `error`, error);
    }
  }

  private asRedisKey(actorId: string, messageId: string) {
    return this.keyPrefix + actorId + "/" + messageId;
  }
}
