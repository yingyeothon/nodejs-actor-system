export default interface ILockAcquire {
  tryAcquire: (actorId: string) => Promise<boolean>;
}
