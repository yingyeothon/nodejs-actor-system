import ActorErrorHandler from "../env/errorHandler";
import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import ActorSingleMessageHandler from "../env/singleMessageHandler";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
import QueueLength from "../../queue/length";
import QueueSingleConsumer from "../../queue/singleConsumer";
export type ActorSingleEnv<T> = ActorProperty & ActorLogger & {
    queue: QueueSingleConsumer & QueueLength;
} & {
    awaiter: AwaiterResolve;
} & ActorSingleMessageHandler<T> & ActorErrorHandler;
export default function processInSingleMode<T>(env: ActorSingleEnv<T>, isAlive: () => boolean): Promise<AwaiterMeta[]>;
