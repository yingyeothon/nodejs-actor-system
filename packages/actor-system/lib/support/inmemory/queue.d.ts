import IQueueBulkConsumer from "../../queue/bulkConsumer";
import IQueueLength from "../../queue/length";
import IQueueProducer from "../../queue/producer";
import IQueueSingleConsumer from "../../queue/singleConsumer";
export default class InMemoryQueue implements IQueueLength, IQueueProducer, IQueueSingleConsumer, IQueueBulkConsumer {
    private readonly queues;
    size: (actorId: string) => Promise<number>;
    push: <T>(actorId: string, item: T) => Promise<void>;
    pop: <T>(actorId: string) => Promise<T | null>;
    peek: <T>(actorId: string) => Promise<T | null>;
    flush: <T>(actorId: string) => Promise<T[]>;
}
