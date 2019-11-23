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

type AnyOrPromise = any | Promise<any>;

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

type ActorMessageConsumer<T> =
  | IActorMessageSingleConsumer<T>
  | IActorMessageBulkConsumer<T>;

export interface IActorOptionalHandler {
  onError?: (error: Error) => AnyOrPromise;
}

export type ActorEnvironment<T> = IActorProperty &
  IActorSubsystem &
  ActorMessageConsumer<T> &
  IActorOptionalHandler;

type HandlersForSingle<T> = Omit<IActorMessageSingleConsumer<T>, "_consume"> &
  IActorOptionalHandler;

type HandlersForBulk<T> = Omit<IActorMessageBulkConsumer<T>, "_consume"> &
  IActorOptionalHandler;

type ValueOrGenerator<T> = (() => T) | T;

export const newEnv = (subsys: IActorSubsystem) => <T>(
  either: ValueOrGenerator<HandlersForSingle<T> & IActorProperty>
): ActorEnvironment<T> => ({
  ...subsys,
  ...(typeof either === "function" ? either() : either),
  _consume: "single"
});

export const newBulkEnv = (subsys: IActorSubsystem) => <T>(
  either: ValueOrGenerator<HandlersForBulk<T> & IActorProperty>
): ActorEnvironment<T> => ({
  ...subsys,
  ...(typeof either === "function" ? either() : either),
  _consume: "bulk"
});
