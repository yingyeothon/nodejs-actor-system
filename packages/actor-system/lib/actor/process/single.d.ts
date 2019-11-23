import { IActorMessageSingleConsumer, IActorOptionalHandler, IActorProperty, IActorSubsystem } from "../env";
import { IAwaiterMeta } from "../message";
declare type SingleEnv<T> = IActorProperty & IActorSubsystem & IActorMessageSingleConsumer<T> & IActorOptionalHandler;
export declare const processInSingleMode: <T>(env: SingleEnv<T>, isAlive: () => boolean) => Promise<IAwaiterMeta[]>;
export {};
