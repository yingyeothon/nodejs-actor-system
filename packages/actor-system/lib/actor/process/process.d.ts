import { ActorEnvironment } from "../env";
import { IAwaiterMeta } from "../message";
import { IActorProcessOptions } from "./options";
export declare const tryToProcess: <T>(env: ActorEnvironment<T>, { oneShot, aliveMillis, shiftable }?: IActorProcessOptions) => Promise<IAwaiterMeta[]>;
