import { IActorMessageBulkConsumer, IActorOptionalHandler, IActorProperty, IActorSubsystem } from "../env";
import { IAwaiterMeta } from "../message";
export declare type ActorBulkEnv<T> = IActorProperty & Pick<IActorSubsystem, "logger" | "queue" | "awaiter"> & IActorMessageBulkConsumer<T> & IActorOptionalHandler;
export declare const processInBulkMode: <T>(env: ActorBulkEnv<T>, isAlive: () => boolean) => Promise<IAwaiterMeta[]>;
