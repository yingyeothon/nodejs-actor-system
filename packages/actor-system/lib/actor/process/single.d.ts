import { IActorMessageSingleConsumer, IActorOptionalHandler, IActorProperty, IActorSubsystem } from "../env";
import { IAwaiterMeta } from "../message";
export declare type ActorSingleEnv<T> = IActorProperty & Pick<IActorSubsystem, "logger" | "queue" | "awaiter"> & IActorMessageSingleConsumer<T> & IActorOptionalHandler;
export declare const processInSingleMode: <T>(env: ActorSingleEnv<T>, isAlive: () => boolean) => Promise<IAwaiterMeta[]>;
