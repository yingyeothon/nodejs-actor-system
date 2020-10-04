export default interface LockRelease {
    release: (actorId: string) => Promise<boolean>;
}
