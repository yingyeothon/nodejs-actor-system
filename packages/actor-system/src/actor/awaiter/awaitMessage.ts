import { nullLogger } from "@yingyeothon/logger";
import IAwaiterWait from "../../awaiter/wait";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";

export default async function awaitMessage(
  env: IActorProperty & IActorLogger & { awaiter: IAwaiterWait },
  messageId: string,
  awaitTimeoutMillis: number
) {
  const { id, awaiter, logger = nullLogger } = env;
  logger.debug(`actor`, `await-message`, id, messageId, awaitTimeoutMillis);
  return awaiter.wait(id, messageId, awaitTimeoutMillis);
}
