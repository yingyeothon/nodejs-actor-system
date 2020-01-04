export default interface IQueueProducer {
    push: <T>(actorId: string, item: T) => Promise<void>;
}
