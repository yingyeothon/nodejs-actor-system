import IAwaiterWait from "../../awaiter/wait";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IAwaiterMeta from "../message/awaiterMeta";
import AwaitPolicy from "../message/awaitPolicy";
import awaitMessage from "./awaitMessage";

export default async function awaitMessageAfterTryToProcess(
  env: IActorProperty & IActorLogger & { awaiter: IAwaiterWait },
  currentMeta: IAwaiterMeta,
  tryToProcess: () => Promise<IAwaiterMeta[]>
): Promise<boolean> {
  // Try to process and collect resolved message ids.
  const resolvedMetas = await tryToProcess();

  // If we don't want to await this request, just return true.
  if (currentMeta.awaitPolicy === AwaitPolicy.Forget) {
    return true;
  }

  // Or, it processed in this thread luckly. Then return true.
  if (resolvedMetas.some(meta => meta.messageId === currentMeta.messageId)) {
    return true;
  }

  // Or, other thread would process it as soon as possible.
  // We will wait until then.
  return awaitMessage(
    env,
    currentMeta.messageId,
    currentMeta.awaitTimeoutMillis
  );
}
