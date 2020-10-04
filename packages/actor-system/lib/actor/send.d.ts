import { ActorEnqueueEnvironment } from "./enqueue";
import { ActorProcessEnvironment } from "./process";
import ActorProcessOptions from "./process/options";
import AwaiterWait from "../awaiter/wait";
import UserMessageItem from "./message/userMessageItem";
import UserMessageMeta from "./message/userMessageMeta";
export declare type ActorSendEnvironment<T> = ActorEnqueueEnvironment & ActorProcessEnvironment<T> & {
    awaiter: AwaiterWait;
};
export default function send<T>(env: ActorSendEnvironment<T>, input: UserMessageItem<T> & Partial<UserMessageMeta>, options?: ActorProcessOptions): Promise<boolean>;
