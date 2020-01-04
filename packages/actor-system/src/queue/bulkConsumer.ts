export default interface IQueueBulkConsumer {
  flush: <T>(actorId: string) => Promise<T[]>;
}
