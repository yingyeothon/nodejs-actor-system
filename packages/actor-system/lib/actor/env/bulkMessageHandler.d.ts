export default interface IActorMessageBulkConsumer<T> {
    _consume: "bulk";
    onMessages: (messages: T[]) => any | Promise<any>;
}
