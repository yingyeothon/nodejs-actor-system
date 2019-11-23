import { ILock } from "../../lock";

export class InMemoryLock implements ILock {
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
