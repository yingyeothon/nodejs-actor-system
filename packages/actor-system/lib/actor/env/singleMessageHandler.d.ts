export default interface IActorSingleMessageHandler<T> {
    _consume: "single";
    onMessage: (message: T) => any | Promise<any>;
    onPrepare?: (id: string) => any | Promise<any>;
    onCommit?: (id: string) => any | Promise<any>;
}
