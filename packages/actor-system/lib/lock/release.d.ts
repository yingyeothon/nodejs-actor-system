export default interface ILockRelease {
    release: (actorId: string) => Promise<boolean>;
}
