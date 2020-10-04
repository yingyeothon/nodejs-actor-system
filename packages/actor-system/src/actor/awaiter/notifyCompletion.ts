import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
import { nullLogger } from "@yingyeothon/logger";

export default async function notifyCompletion(
  env: ActorProperty & ActorLogger & { awaiter: AwaiterResolve },
  meta: AwaiterMeta
): Promise<void> {
  const { id, logger = nullLogger, awaiter } = env;
  try {
    logger.debug(`actor`, `awaiter-resolve`, id, meta.messageId);
    await awaiter.resolve(id, meta.messageId);
  } catch (error) {
    logger.error(`actor`, `awaiter-resolve-error`, id, error);
  }
}
