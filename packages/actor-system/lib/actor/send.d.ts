import IAwaiterWait from "../awaiter/wait";
import IQueueProducer from "../queue/producer";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";
import { ActorProcessEnvironment } from "./process";
import IActorProcessOptions from "./process/options";
declare type ActorSendEnvironment<T> = ActorProcessEnvironment<T> & {
    queue: IQueueProducer;
} & {
    awaiter: IAwaiterWait;
};
export default function send<T>(env: ActorSendEnvironment<T>, input: IUserMessageItem<T> & Partial<IUserMessageMeta>, options?: IActorProcessOptions): Promise<boolean>;
export {};
