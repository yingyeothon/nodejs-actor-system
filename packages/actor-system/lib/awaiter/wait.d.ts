export default interface AwaiterWait {
    wait: (actorId: string, messageId: string, timeoutMillis: number) => Promise<boolean>;
}
