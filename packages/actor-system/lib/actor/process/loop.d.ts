import ILockRelease from "../../lock/release";
import ILockAcquire from "../../lock/tryAcquire";
import IAwaiterMeta from "../message/awaiterMeta";
import { ActorBulkEnv } from "./bulk";
import { ActorSingleEnv } from "./single";
export declare type ActorLoopEnvironment<T> = (ActorSingleEnv<T> | ActorBulkEnv<T>) & {
    lock: ILockAcquire & ILockRelease;
};
export default function processLoop<T>(env: ActorLoopEnvironment<T>, isAlive: () => boolean): Promise<IAwaiterMeta[]>;
