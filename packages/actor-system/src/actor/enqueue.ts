import { nullLogger } from "@yingyeothon/logger";
import { v4 as uuidv4 } from "uuid";
import IQueueProducer from "../queue/producer";
import IActorLogger from "./env/logger";
import IActorProperty from "./env/property";
import AwaitPolicy from "./message/awaitPolicy";
import IUserMessage from "./message/userMessage";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";

export default async function enqueue<T>(
  env: IActorProperty & IActorLogger & { queue: IQueueProducer },
  input: IUserMessageItem<T> & Partial<IUserMessageMeta>
): Promise<IUserMessage<T>> {
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
}
