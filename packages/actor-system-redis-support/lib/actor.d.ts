import * as Actor from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";
interface IRedisOptions {
    redis?: IORedis.Redis;
    keyPrefix?: string;
    logger?: ILogger;
}
export declare const newRedisSubsystem: ({ redis, keyPrefix, logger }: IRedisOptions) => Pick<Actor.IActorSubsystem, "awaiter" | "queue" | "lock">;
export {};
