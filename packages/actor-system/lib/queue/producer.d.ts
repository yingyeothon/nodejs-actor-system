export default interface QueueProducer {
    push: <T>(actorId: string, item: T) => Promise<void>;
}
