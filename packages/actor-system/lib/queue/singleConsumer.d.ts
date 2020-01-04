export default interface IQueueSingleConsumer {
    pop: <T>(actorId: string) => Promise<T | null>;
    peek: <T>(actorId: string) => Promise<T | null>;
}
