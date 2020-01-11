import IAwaiterWait from "../awaiter/wait";
import { ActorEnqueueEnvironment } from "./enqueue";
import IActorProperty from "./env/property";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";
export declare type ActorPostEnvironment = IActorProperty & ActorEnqueueEnvironment & {
    awaiter: IAwaiterWait;
};
export default function post<T>(env: ActorPostEnvironment, input: IUserMessageItem<T> & Partial<IUserMessageMeta>): Promise<boolean>;
