import { ILogger } from "@yingyeothon/logger";
import { IAwaiter } from "../awaiter";
import { ILock } from "../lock";
import { IQueue } from "../queue";
import { ActorShift } from "../shift";
export interface IActorProperty {
    id: string;
}
export interface IActorSubsystem {
    queue: IQueue;
    lock: ILock;
    awaiter: IAwaiter;
    shift?: ActorShift;
    logger?: ILogger;
}
declare type AnyOrPromise = any | Promise<any>;
export interface IActorMessageSingleConsumer<T> {
    _consume: "single";
    onMessage: (message: T) => AnyOrPromise;
    onPrepare?: (id: string) => AnyOrPromise;
    onCommit?: (id: string) => AnyOrPromise;
}
export interface IActorMessageBulkConsumer<T> {
    _consume: "bulk";
    onMessages: (message: T[]) => AnyOrPromise;
}
declare type ActorMessageConsumer<T> = IActorMessageSingleConsumer<T> | IActorMessageBulkConsumer<T>;
export interface IActorOptionalHandler {
    onError?: (error: Error) => AnyOrPromise;
}
export declare type ActorEnvironment<T> = IActorProperty & IActorSubsystem & ActorMessageConsumer<T> & IActorOptionalHandler;
declare type ValueOrGenerator<T> = (() => T) | T;
export declare const newEnv: (subsys: IActorSubsystem) => <T>(either: ValueOrGenerator<Pick<IActorMessageSingleConsumer<T>, "onMessage" | "onPrepare" | "onCommit"> & IActorOptionalHandler & IActorProperty>) => ActorEnvironment<T>;
export declare const newBulkEnv: (subsys: IActorSubsystem) => <T>(either: ValueOrGenerator<Pick<IActorMessageBulkConsumer<T>, "onMessages"> & IActorOptionalHandler & IActorProperty>) => ActorEnvironment<T>;
export {};
