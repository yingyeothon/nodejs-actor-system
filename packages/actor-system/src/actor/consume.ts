import { ActorEnvironment } from "./env";
import { IActorProcessOptions, processLoop } from "./process";

/**
 * A function that continuously tries to process this `Actor`'s messages for the alive time.
 *
 * When a background thread performs `consumeUtil` function to process all of messages in this actor,
 * it can improve overall response time of other threads which `post` a message to this actor.
 */
export const consumeUntil = async <T>(
  env: ActorEnvironment<T>,
  options: Omit<IActorProcessOptions, "shiftTimeout"> & {
    untilMillis: number;
  }
) => {
  const startMillis = Date.now();
  do {
    await processLoop(env, () => true);
  } while (Date.now() - startMillis < options.untilMillis);
};
