import ActorLogger from "./env/logger";
import ActorProperty from "./env/property";
import LockAcquire from "../lock/tryAcquire";
import LockRelease from "../lock/release";
import QueueBulkConsumer from "../queue/bulkConsumer";
export declare type ActroEventLoopEnvironment<T> = ActorProperty & ActorLogger & {
    lock: LockAcquire & LockRelease;
} & {
    queue: QueueBulkConsumer;
} & {
    loop: (poll: () => Promise<T[]>) => Promise<void>;
};
export default function eventLoop<T>(env: ActroEventLoopEnvironment<T>): Promise<boolean>;
