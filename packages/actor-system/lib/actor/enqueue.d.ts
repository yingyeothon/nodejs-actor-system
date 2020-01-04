import IQueueProducer from "../queue/producer";
import IActorLogger from "./env/logger";
import IActorProperty from "./env/property";
import IUserMessage from "./message/userMessage";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";
export default function enqueue<T>(env: IActorProperty & IActorLogger & {
    queue: IQueueProducer;
}, input: IUserMessageItem<T> & Partial<IUserMessageMeta>): Promise<IUserMessage<T>>;
