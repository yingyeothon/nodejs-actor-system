import { nullLogger } from "@yingyeothon/logger";
import { IActorProperty, IActorSubsystem } from "./env";
import { AwaitPolicy, IAwaiterMeta } from "./message";

export const notifyCompletion = async (
  env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">,
  meta: IAwaiterMeta
): Promise<void> => {
  const { id, logger = nullLogger, awaiter } = env;
  try {
    logger.debug(`actor`, `awaiter-resolve`, id, meta.messageId);
    await awaiter.resolve(id, meta.messageId);
  } catch (error) {
    logger.error(`actor`, `awaiter-resolve-error`, id, error);
  }
};

export const notifyCompletions = async (
  env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">,
  metas: IAwaiterMeta[]
): Promise<void> => {
  const { id, logger = nullLogger, awaiter } = env;
  try {
    const targetIds = metas.map(({ messageId }) => messageId);
    logger.debug(`actor`, `awaiter-resolve`, id, targetIds);
    if (targetIds.length === 0) {
      return;
    }

    await Promise.all(
      targetIds.map(messageId => awaiter.resolve(id, messageId))
    );
  } catch (error) {
    logger.error(`actor`, `awaiter-resolve-error`, id, error);
  }
};

export const awaitMessage = async (
  env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "awaiter" | "logger">,
  messageId: string,
  awaitTimeoutMillis: number
) => {
  const { id, awaiter, logger = nullLogger } = env;
  logger.debug(`actor`, `await-message`, id, messageId, awaitTimeoutMillis);
  return awaiter.wait(id, messageId, awaitTimeoutMillis);
};

export const awaitMessageAfterTryToProcess = async (
  env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "logger" | "awaiter">,
  currentMeta: IAwaiterMeta,
  tryToProcess: () => Promise<IAwaiterMeta[]>
): Promise<boolean> => {
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
};
