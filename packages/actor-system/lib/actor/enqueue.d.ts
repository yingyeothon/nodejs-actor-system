import ActorLogger from "./env/logger";
import ActorProperty from "./env/property";
import QueueProducer from "../queue/producer";
import UserMessage from "./message/userMessage";
import UserMessageItem from "./message/userMessageItem";
import UserMessageMeta from "./message/userMessageMeta";
export declare type ActorEnqueueEnvironment = ActorProperty & ActorLogger & {
    queue: QueueProducer;
};
export default function enqueue<T>(env: ActorEnqueueEnvironment, input: UserMessageItem<T> & Partial<UserMessageMeta>): Promise<UserMessage<T>>;
