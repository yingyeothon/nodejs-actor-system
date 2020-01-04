export default interface IActorErrorHandler {
  onError?: (error: Error) => any | Promise<any>;
}
