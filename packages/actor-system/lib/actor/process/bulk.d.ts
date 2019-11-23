import { IActorMessageBulkConsumer, IActorOptionalHandler, IActorProperty, IActorSubsystem } from "../env";
import { IAwaiterMeta } from "../message";
declare type BulkEnv<T> = IActorProperty & IActorSubsystem & IActorMessageBulkConsumer<T> & IActorOptionalHandler;
export declare const processInBulkMode: <T>(env: BulkEnv<T>, isAlive: () => boolean) => Promise<IAwaiterMeta[]>;
export {};
