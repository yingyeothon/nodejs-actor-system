import { IActorProperty, IActorSubsystem } from "./env";
import { IUserMessageItem, IUserMessageMeta } from "./message";
export declare const post: <T>(env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter" | "queue">, input: IUserMessageItem<T> & Partial<IUserMessageMeta>) => Promise<boolean>;
