import IAwaiterMeta from "../message/awaiterMeta";

export const maybeAwait = async (result: Promise<any> | any) => {
  if (!result) {
    return;
  }
  if (result instanceof Promise) {
    await result;
  }
  if (result.constructor.name === "Promise") {
    await result;
  }
};

export const copyAwaiterMeta = (input: IAwaiterMeta): IAwaiterMeta => ({
  messageId: input.messageId,
  awaitPolicy: input.awaitPolicy,
  awaitTimeoutMillis: input.awaitTimeoutMillis
});
