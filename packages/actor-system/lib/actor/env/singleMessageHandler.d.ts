export default interface ActorSingleMessageHandler<T> {
    _consume: "single";
    onMessage: (message: T) => unknown | Promise<unknown>;
    onPrepare?: (id: string) => unknown | Promise<unknown>;
    onCommit?: (id: string) => unknown | Promise<unknown>;
}
