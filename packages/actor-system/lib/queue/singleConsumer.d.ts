export default interface QueueSingleConsumer {
    pop: <T>(actorId: string) => Promise<T | null>;
    peek: <T>(actorId: string) => Promise<T | null>;
}
