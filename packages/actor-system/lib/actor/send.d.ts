import IAwaiterWait from "../awaiter/wait";
import { ActorEnqueueEnvironment } from "./enqueue";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";
import { ActorProcessEnvironment } from "./process";
import IActorProcessOptions from "./process/options";
export declare type ActorSendEnvironment<T> = ActorEnqueueEnvironment & ActorProcessEnvironment<T> & {
    awaiter: IAwaiterWait;
};
export default function send<T>(env: ActorSendEnvironment<T>, input: IUserMessageItem<T> & Partial<IUserMessageMeta>, options?: IActorProcessOptions): Promise<boolean>;
