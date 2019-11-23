import { ActorEnvironment } from "./env";
import { IActorProcessOptions } from "./process";
export declare const consumeUntil: <T>(env: ActorEnvironment<T>, options: Pick<IActorProcessOptions, never> & {
    untilMillis: number;
}) => Promise<void>;
