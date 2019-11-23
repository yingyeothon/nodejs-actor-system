export interface IAwaiter {
  wait(
    actorId: string,
    messageId: string,
    timeoutMillis: number
  ): Promise<boolean>;
  resolve(actorId: string, messageId: string): Promise<void>;
}
