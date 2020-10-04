import { ActorBulkEnv } from "./bulk";
import { ActorSingleEnv } from "./single";
import AwaiterMeta from "../message/awaiterMeta";
import LockAcquire from "../../lock/tryAcquire";
import LockRelease from "../../lock/release";
export declare type ActorLoopEnvironment<T> = (ActorSingleEnv<T> | ActorBulkEnv<T>) & {
    lock: LockAcquire & LockRelease;
};
export default function processLoop<T>(env: ActorLoopEnvironment<T>, isAlive: () => boolean): Promise<AwaiterMeta[]>;
