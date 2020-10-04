import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterWait from "../../awaiter/wait";
import { nullLogger } from "@yingyeothon/logger";

export default async function awaitMessage(
  env: ActorProperty & ActorLogger & { awaiter: AwaiterWait },
  messageId: string,
  awaitTimeoutMillis: number
): Promise<boolean> {
  const { id, awaiter, logger = nullLogger } = env;
  logger.debug(`actor`, `await-message`, id, messageId, awaitTimeoutMillis);
  return awaiter.wait(id, messageId, awaitTimeoutMillis);
}
