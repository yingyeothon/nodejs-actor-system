import ILockRelease from "../../lock/release";
import ILockAcquire from "../../lock/tryAcquire";
export default class InMemoryLock implements ILockRelease, ILockAcquire {
    private readonly lockHolders;
    tryAcquire(actorId: string): Promise<boolean>;
    release(actorId: string): Promise<boolean>;
}
