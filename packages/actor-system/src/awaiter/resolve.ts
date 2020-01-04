export default interface IAwaiterResolve {
  resolve: (actorId: string, messageId: string) => Promise<void>;
}
