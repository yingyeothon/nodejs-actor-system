import { nullLogger } from "@yingyeothon/logger";
import { v4 as uuidv4 } from "uuid";
import { IActorProperty, IActorSubsystem } from "./env";
import {
  AwaitPolicy,
  IUserMessage,
  IUserMessageItem,
  IUserMessageMeta
} from "./message";

export const enqueue = async <T>(
  env: Pick<IActorProperty, "id"> & Pick<IActorSubsystem, "queue" | "logger">,
  input: IUserMessageItem<T> & Partial<IUserMessageMeta>
): Promise<IUserMessage<T>> => {
  const { id, queue, logger = nullLogger } = env;
  const message: IUserMessage<T> = {
    messageId: input.messageId || uuidv4(),
    awaitPolicy: input.awaitPolicy || AwaitPolicy.Forget,
    item: input.item,
    awaitTimeoutMillis: input.awaitTimeoutMillis || 0
  };

  await queue.push(id, message);
  logger.debug(`actor`, `enqueue`, id, message);
  return message;
};
