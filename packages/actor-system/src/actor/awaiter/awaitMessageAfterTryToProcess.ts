import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaitPolicy from "../message/awaitPolicy";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterWait from "../../awaiter/wait";
import awaitMessage from "./awaitMessage";

export default async function awaitMessageAfterTryToProcess(
  env: ActorProperty & ActorLogger & { awaiter: AwaiterWait },
  currentMeta: AwaiterMeta,
  tryToProcess: () => Promise<AwaiterMeta[]>
): Promise<boolean> {
  // Try to process and collect resolved message ids.
  const resolvedMetas = await tryToProcess();

  // If we don't want to await this request, just return true.
  if (currentMeta.awaitPolicy === AwaitPolicy.Forget) {
    return true;
  }

  // Or, it processed in this thread luckly. Then return true.
  if (resolvedMetas.some((meta) => meta.messageId === currentMeta.messageId)) {
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
