import ILockRelease from "../lock/release";
import ILockAcquire from "../lock/tryAcquire";
import QueueBulkConsumer from "../queue/bulkConsumer";
import IActorLogger from "./env/logger";
import IActorProperty from "./env/property";
export declare type ActroEventLoopEnvironment<T> = IActorProperty & IActorLogger & {
    lock: ILockAcquire & ILockRelease;
} & {
    queue: QueueBulkConsumer;
} & {
    loop: (poll: () => Promise<T[]>) => Promise<void>;
};
export default function eventLoop<T>(env: ActroEventLoopEnvironment<T>): Promise<boolean>;
