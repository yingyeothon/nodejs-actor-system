import { IActorProperty, IActorSubsystem } from "./env";
import { IUserMessage, IUserMessageItem, IUserMessageMeta } from "./message";
export declare const enqueue: <T>(env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "queue">, input: IUserMessageItem<T> & Partial<IUserMessageMeta>) => Promise<IUserMessage<T>>;
