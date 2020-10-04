export default interface QueueLength {
  size: (actorId: string) => Promise<number>;
}
