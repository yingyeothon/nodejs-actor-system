import LockAcquire from "../../lock/tryAcquire";
import LockRelease from "../../lock/release";
export default class InMemoryLock implements LockRelease, LockAcquire {
    private readonly lockHolders;
    tryAcquire(actorId: string): Promise<boolean>;
    release(actorId: string): Promise<boolean>;
}
