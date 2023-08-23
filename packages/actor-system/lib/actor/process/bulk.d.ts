import ActorBulkMessageHandler from "../env/bulkMessageHandler";
import ActorErrorHandler from "../env/errorHandler";
import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
import QueueBulkConsumer from "../../queue/bulkConsumer";
import QueueLength from "../../queue/length";
export type ActorBulkEnv<T> = ActorProperty & ActorLogger & {
    queue: QueueBulkConsumer & QueueLength;
} & {
    awaiter: AwaiterResolve;
} & ActorBulkMessageHandler<T> & ActorErrorHandler;
export default function processInBulkMode<T>(env: ActorBulkEnv<T>, isAlive: () => boolean): Promise<AwaiterMeta[]>;
