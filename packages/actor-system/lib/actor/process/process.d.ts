import { ActorEnvironment } from "../env";
import { IAwaiterMeta } from "../message";
import { IActorProcessOptions } from "./options";
export declare const tryToProcess: <T>(env: ActorEnvironment<T>, { shiftTimeout }?: IActorProcessOptions) => Promise<IAwaiterMeta[]>;
export declare const processLoop: <T>(env: ActorEnvironment<T>, isAlive: () => boolean) => Promise<IAwaiterMeta[]>;
