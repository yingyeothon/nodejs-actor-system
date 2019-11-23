import { IActorProperty, IActorSubsystem } from "./env";
import { IAwaiterMeta } from "./message";
export declare const notifyCompletion: (env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">, meta: IAwaiterMeta) => Promise<void>;
export declare const notifyCompletions: (env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">, metas: IAwaiterMeta[]) => Promise<void>;
export declare const awaitMessage: (env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">, messageId: string, awaitTimeoutMillis: number) => Promise<boolean>;
export declare const awaitMessageAfterTryToProcess: (env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">, currentMeta: IAwaiterMeta, tryToProcess: () => Promise<IAwaiterMeta[]>) => Promise<boolean>;
