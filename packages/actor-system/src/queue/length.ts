export default interface IQueueLength {
  size: (actorId: string) => Promise<number>;
}
