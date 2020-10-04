import ActorLogger from "./env/logger";
import ActorProperty from "./env/property";
import AwaitPolicy from "./message/awaitPolicy";
import QueueProducer from "../queue/producer";
import UserMessage from "./message/userMessage";
import UserMessageItem from "./message/userMessageItem";
import UserMessageMeta from "./message/userMessageMeta";
import { nullLogger } from "@yingyeothon/logger";
import { v4 as uuidv4 } from "uuid";

export type ActorEnqueueEnvironment = ActorProperty &
  ActorLogger & { queue: QueueProducer };

export default async function enqueue<T>(
  env: ActorEnqueueEnvironment,
  input: UserMessageItem<T> & Partial<UserMessageMeta>
): Promise<UserMessage<T>> {
  const { id, queue, logger = nullLogger } = env;
  const message: UserMessage<T> = {
    messageId: input.messageId || uuidv4(),
    awaitPolicy: input.awaitPolicy || AwaitPolicy.Forget,
    item: input.item,
    awaitTimeoutMillis: input.awaitTimeoutMillis || 0,
  };

  await queue.push(id, message);
  logger.debug(`actor`, `enqueue`, id, message);
  return message;
}
