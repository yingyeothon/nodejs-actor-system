import { ActorEnvironment } from "./env";
import { IUserMessageItem, IUserMessageMeta } from "./message";
import { IActorProcessOptions } from "./process";
export declare const send: <T>(env: ActorEnvironment<T>, input: IUserMessageItem<T> & Partial<IUserMessageMeta>, options?: IActorProcessOptions) => Promise<boolean>;
