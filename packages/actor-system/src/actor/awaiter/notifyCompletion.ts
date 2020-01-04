import { nullLogger } from "@yingyeothon/logger";
import IAwaiterResolve from "../../awaiter/resolve";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IAwaiterMeta from "../message/awaiterMeta";

export default async function notifyCompletion(
  env: IActorProperty & IActorLogger & { awaiter: IAwaiterResolve },
  meta: IAwaiterMeta
): Promise<void> {
  const { id, logger = nullLogger, awaiter } = env;
  try {
    logger.debug(`actor`, `awaiter-resolve`, id, meta.messageId);
    await awaiter.resolve(id, meta.messageId);
  } catch (error) {
    logger.error(`actor`, `awaiter-resolve-error`, id, error);
  }
}
