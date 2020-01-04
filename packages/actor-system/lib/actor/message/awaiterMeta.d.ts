import AwaitPolicy from "./awaitPolicy";
export default interface IAwaiterMeta {
    messageId: string;
    awaitPolicy: AwaitPolicy;
    awaitTimeoutMillis: number;
}
