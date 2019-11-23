import { ILock } from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";

interface IRedisLockArguments {
  redis?: IORedis.Redis;
  keyPrefix?: string;
  logger?: ILogger;
  lockTimeout?: number;
}

export class RedisLock implements ILock {
  private static readonly Locked = "1";

  private readonly redis: IORedis.Redis;
  private readonly keyPrefix: string;
  private readonly logger: ILogger;
  private readonly lockTimeout: number;

  constructor({
    redis = new IORedis(),
    keyPrefix = "lock:",
    logger = new ConsoleLogger(),
    lockTimeout = -1
  }: IRedisLockArguments = {}) {
    this.redis = redis;
    this.keyPrefix = keyPrefix;
    this.logger = logger;
    this.lockTimeout = lockTimeout;
  }

  public async tryAcquire(actorId: string) {
    const redisKey = this.asRedisKey(actorId);
    let success: boolean = false;
    if (this.lockTimeout > 0) {
      const ok: string = await this.redis.set(
        redisKey,
        RedisLock.Locked,
        "PX",
        this.lockTimeout,
        "NX"
      );
      success = ok === "OK";
    } else {
      const one: number = await this.redis.setnx(redisKey, RedisLock.Locked);
      success = one === 1;
    }

    this.logger.debug(`redis-lock`, `try-acquire`, redisKey, success);
    return success;
  }

  public async release(actorId: string) {
    const redisKey = this.asRedisKey(actorId);
    await this.redis.del(redisKey);
    this.logger.debug(`redis-lock`, `release`, redisKey);
    return true;
  }

  private asRedisKey = (name: string) => this.keyPrefix + name;
}
