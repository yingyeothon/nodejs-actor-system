/**
 * Messages requested to an actor may be processed late.
 * This policy is kind of how long to wait for it.
 */
export enum AwaitPolicy {
  /**
   * I don't want to wait anything.
   * But it doesn't ensure it will finish immediately because this thread
   * can process all of messages from this actor's queue in bad luck.
   */
  Forget,

  /**
   * I want to wait only until the completion of `act` call of my message.
   * But it doesn't ensure this modification is committed completely.
   */
  Act,

  /**
   * I want to wait until the completion of `after-act` call.
   * It will ensure that my message would be completed perfectly,
   * but because of this it may take a long time.
   */
  Commit
}

export interface IAwaiterMeta {
  messageId: string;
  awaitPolicy: AwaitPolicy;
  awaitTimeoutMillis: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IUserMessageMeta extends IAwaiterMeta {}

export interface IUserMessageItem<T> {
  item: T;
}

export interface IUserMessage<T>
  extends IUserMessageItem<T>,
    IUserMessageMeta {}
