import { ActorLoopEnvironment } from "./process/loop";
import ActorProcessOptions from "./process/options";
import ActorShifter from "../shift";
import AwaiterMeta from "./message/awaiterMeta";
export type ActorProcessEnvironment<T> = ActorLoopEnvironment<T> & {
    shift?: ActorShifter;
};
export default function tryToProcess<T>(env: ActorProcessEnvironment<T>, { oneShot, aliveMillis, shiftable }?: ActorProcessOptions): Promise<AwaiterMeta[]>;
