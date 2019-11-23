export declare enum AwaitPolicy {
    Forget = 0,
    Act = 1,
    Commit = 2
}
export interface IAwaiterMeta {
    messageId: string;
    awaitPolicy: AwaitPolicy;
    awaitTimeoutMillis: number;
}
export interface IUserMessageMeta extends IAwaiterMeta {
}
export interface IUserMessageItem<T> {
    item: T;
}
export interface IUserMessage<T> extends IUserMessageItem<T>, IUserMessageMeta {
}
