export const Resolved = "1";

export const asRedisKey = (
  keyPrefix: string,
  actorId: string,
  messageId: string
) => `${keyPrefix}${actorId}/${messageId}`;
