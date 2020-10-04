export default interface QueueBulkConsumer {
    flush: <T>(actorId: string) => Promise<T[]>;
}
