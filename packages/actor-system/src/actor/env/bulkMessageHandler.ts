export default interface ActorMessageBulkConsumer<T> {
  _consume: "bulk";
  onMessages: (messages: T[]) => unknown | Promise<unknown>;
}
