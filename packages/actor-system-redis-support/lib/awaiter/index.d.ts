import IAwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import IAwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface IRedisAwaiterArguments {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
}
export declare class RedisAwaiter implements IAwaiterResolve, IAwaiterWait {
    wait: (actorId: string, messageId: string, timeoutMillis: number) => Promise<boolean>;
    resolve: (actorId: string, messageId: string) => Promise<void>;
    constructor(args: IRedisAwaiterArguments);
}
export {};
