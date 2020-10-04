export default interface LockAcquire {
    tryAcquire: (actorId: string) => Promise<boolean>;
}
