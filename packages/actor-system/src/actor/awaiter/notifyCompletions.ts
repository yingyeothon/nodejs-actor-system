import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
import { nullLogger } from "@yingyeothon/logger";

export default async function notifyCompletions(
  env: ActorProperty & ActorLogger & { awaiter: AwaiterResolve },
  metas: AwaiterMeta[]
): Promise<void> {
  const { id, logger = nullLogger, awaiter } = env;
  try {
    const targetIds = metas.map(({ messageId }) => messageId);
    logger.debug(`actor`, `awaiter-resolve`, id, targetIds);
    if (targetIds.length === 0) {
      return;
    }

    await Promise.all(
      targetIds.map((messageId) => awaiter.resolve(id, messageId))
    );
  } catch (error) {
    logger.error(`actor`, `awaiter-resolve-error`, id, error);
  }
}
