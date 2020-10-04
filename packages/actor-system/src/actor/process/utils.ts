import AwaiterMeta from "../message/awaiterMeta";

export async function maybeAwait(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<unknown> | any
): Promise<void> {
  if (!result) {
    return;
  }
  if (result instanceof Promise) {
    await result;
  }
  if (result.constructor.name === "Promise") {
    await result;
  }
}

export function copyAwaiterMeta(input: AwaiterMeta): AwaiterMeta {
  return {
    messageId: input.messageId,
    awaitPolicy: input.awaitPolicy,
    awaitTimeoutMillis: input.awaitTimeoutMillis,
  };
}
