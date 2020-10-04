export const Resolved = "1";

export function asRedisKey(
  keyPrefix: string,
  actorId: string,
  messageId: string
): string {
  return `${keyPrefix}${actorId}/${messageId}`;
}
