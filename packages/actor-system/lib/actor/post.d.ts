import IAwaiterWait from "../awaiter/wait";
import IQueueProducer from "../queue/producer";
import IActorLogger from "./env/logger";
import IActorProperty from "./env/property";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";
export default function post<T>(env: IActorProperty & IActorLogger & {
    queue: IQueueProducer;
} & {
    awaiter: IAwaiterWait;
}, input: IUserMessageItem<T> & Partial<IUserMessageMeta>): Promise<boolean>;
