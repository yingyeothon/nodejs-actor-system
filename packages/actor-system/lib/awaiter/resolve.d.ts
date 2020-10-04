export default interface AwaiterResolve {
    resolve: (actorId: string, messageId: string) => Promise<void>;
}
