export default interface ActorErrorHandler {
    onError?: (error: Error) => unknown | Promise<unknown>;
}
