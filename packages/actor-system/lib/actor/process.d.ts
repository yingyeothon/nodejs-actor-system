import ActorShifter from "../shift";
import IAwaiterMeta from "./message/awaiterMeta";
import { ActorLoopEnvironment } from "./process/loop";
import IActorProcessOptions from "./process/options";
export declare type ActorProcessEnvironment<T> = ActorLoopEnvironment<T> & {
    shift?: ActorShifter;
};
export default function tryToProcess<T>(env: ActorProcessEnvironment<T>, { oneShot, aliveMillis, shiftable }?: IActorProcessOptions): Promise<IAwaiterMeta[]>;
