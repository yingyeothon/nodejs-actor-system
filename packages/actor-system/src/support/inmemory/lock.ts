import LockAcquire from "../../lock/tryAcquire";
import LockRelease from "../../lock/release";

export default class InMemoryLock implements LockRelease, LockAcquire {
  private readonly lockHolders = new Set<string>();

  public async tryAcquire(actorId: string): Promise<boolean> {
    if (this.lockHolders.has(actorId)) {
      return false;
    }
    this.lockHolders.add(actorId);
    return true;
  }

  public async release(actorId: string): Promise<boolean> {
    return this.lockHolders.delete(actorId);
  }
}
