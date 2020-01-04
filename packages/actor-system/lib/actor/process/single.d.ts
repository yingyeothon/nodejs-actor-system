import IAwaiterResolve from "../../awaiter/resolve";
import IQueueLength from "../../queue/length";
import IQueueSingleConsumer from "../../queue/singleConsumer";
import IActorErrorHandler from "../env/errorHandler";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IActorSingleMessageHandler from "../env/singleMessageHandler";
import IAwaiterMeta from "../message/awaiterMeta";
export declare type ActorSingleEnv<T> = IActorProperty & IActorLogger & {
    queue: IQueueSingleConsumer & IQueueLength;
} & {
    awaiter: IAwaiterResolve;
} & IActorSingleMessageHandler<T> & IActorErrorHandler;
export default function processInSingleMode<T>(env: ActorSingleEnv<T>, isAlive: () => boolean): Promise<IAwaiterMeta[]>;
