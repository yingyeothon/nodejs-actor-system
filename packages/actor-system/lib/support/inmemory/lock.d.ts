import { ILock } from "../../lock";
export declare class InMemoryLock implements ILock {
    private readonly lockHolders;
    tryAcquire(actorId: string): Promise<boolean>;
    release(actorId: string): Promise<boolean>;
}
