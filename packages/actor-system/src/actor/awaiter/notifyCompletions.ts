import { nullLogger } from "@yingyeothon/logger";
import IAwaiterResolve from "../../awaiter/resolve";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IAwaiterMeta from "../message/awaiterMeta";

export default async function notifyCompletions(
  env: IActorProperty & IActorLogger & { awaiter: IAwaiterResolve },
  metas: IAwaiterMeta[]
): Promise<void> {
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
}
