import ILockRelease from "../../lock/release";
import ILockAcquire from "../../lock/tryAcquire";

export default class InMemoryLock implements ILockRelease, ILockAcquire {
  private readonly lockHolders = new Set<string>();

  public async tryAcquire(actorId: string) {
    if (this.lockHolders.has(actorId)) {
      return false;
    }
    this.lockHolders.add(actorId);
    return true;
  }

  public async release(actorId: string) {
    return this.lockHolders.delete(actorId);
  }
}
