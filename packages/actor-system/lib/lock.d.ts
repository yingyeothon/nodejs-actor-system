export interface ILock {
    tryAcquire(actorId: string): Promise<boolean>;
    release(actorId: string): Promise<boolean>;
}
