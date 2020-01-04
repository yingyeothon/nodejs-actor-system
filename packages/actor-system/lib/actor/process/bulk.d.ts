import IAwaiterResolve from "../../awaiter/resolve";
import IQueueBulkConsumer from "../../queue/bulkConsumer";
import IQueueLength from "../../queue/length";
import IActorBulkMessageHandler from "../env/bulkMessageHandler";
import IActorErrorHandler from "../env/errorHandler";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IAwaiterMeta from "../message/awaiterMeta";
export declare type ActorBulkEnv<T> = IActorProperty & IActorLogger & {
    queue: IQueueBulkConsumer & IQueueLength;
} & {
    awaiter: IAwaiterResolve;
} & IActorBulkMessageHandler<T> & IActorErrorHandler;
export default function processInBulkMode<T>(env: ActorBulkEnv<T>, isAlive: () => boolean): Promise<IAwaiterMeta[]>;
