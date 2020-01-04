import IAwaiterWait from "../awaiter/wait";
import IQueueProducer from "../queue/producer";
import awaitMessageAfterTryToProcess from "./awaiter/awaitMessageAfterTryToProcess";
import enqueue from "./enqueue";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";
import tryToProcess, { ActorProcessEnvironment } from "./process";
import IActorProcessOptions from "./process/options";

type ActorSendEnvironment<T> = ActorProcessEnvironment<T> & {
  queue: IQueueProducer;
} & { awaiter: IAwaiterWait };

/**
 * Send a message to this `Actor` and try to process that message with `ProcessOptions`.
 * If there is another thread dedicated this actor, `AwaitPolicy` determines when the function completes.
 *
 * Of course, it will handle messages from other threads if this thread takes an `Actor`,
 * In this case the function elapsed may be longer than we expect, so we need to set `IActorProcessOptions` properly.
 */
export default async function send<T>(
  env: ActorSendEnvironment<T>,
  input: IUserMessageItem<T> & Partial<IUserMessageMeta>,
  options: IActorProcessOptions = {}
): Promise<boolean> {
  const message = await enqueue(env, input);
  return awaitMessageAfterTryToProcess(env, message, () =>
    tryToProcess(env, options)
  );
}
