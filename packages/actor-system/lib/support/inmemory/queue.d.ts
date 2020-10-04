import QueueBulkConsumer from "../../queue/bulkConsumer";
import QueueLength from "../../queue/length";
import QueueProducer from "../../queue/producer";
import QueueSingleConsumer from "../../queue/singleConsumer";
export default class InMemoryQueue implements QueueLength, QueueProducer, QueueSingleConsumer, QueueBulkConsumer {
    private readonly queues;
    size: (actorId: string) => Promise<number>;
    push: <T>(actorId: string, item: T) => Promise<void>;
    pop: <T>(actorId: string) => Promise<T | null>;
    peek: <T>(actorId: string) => Promise<T | null>;
    flush: <T>(actorId: string) => Promise<T[]>;
}
