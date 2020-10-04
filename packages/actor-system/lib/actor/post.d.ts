import { ActorEnqueueEnvironment } from "./enqueue";
import ActorProperty from "./env/property";
import AwaiterWait from "../awaiter/wait";
import UserMessageItem from "./message/userMessageItem";
import UserMessageMeta from "./message/userMessageMeta";
export declare type ActorPostEnvironment = ActorProperty & ActorEnqueueEnvironment & {
    awaiter: AwaiterWait;
};
export default function post<T>(env: ActorPostEnvironment, input: UserMessageItem<T> & Partial<UserMessageMeta>): Promise<boolean>;
