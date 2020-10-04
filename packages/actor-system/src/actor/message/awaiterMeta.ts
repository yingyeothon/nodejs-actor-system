import AwaitPolicy from "./awaitPolicy";

export default interface AwaiterMeta {
  messageId: string;
  awaitPolicy: AwaitPolicy;
  awaitTimeoutMillis: number;
}
