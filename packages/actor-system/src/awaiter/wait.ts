export default interface IAwaiterWait {
  wait: (
    actorId: string,
    messageId: string,
    timeoutMillis: number
  ) => Promise<boolean>;
}
