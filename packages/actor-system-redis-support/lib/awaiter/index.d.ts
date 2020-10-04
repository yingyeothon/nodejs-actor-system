import AwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import AwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { LogWriter } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface RedisAwaiterArguments {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
}
export declare class RedisAwaiter implements AwaiterResolve, AwaiterWait {
    wait: (actorId: string, messageId: string, timeoutMillis: number) => Promise<boolean>;
    resolve: (actorId: string, messageId: string) => Promise<void>;
    constructor(args: RedisAwaiterArguments);
}
export {};
