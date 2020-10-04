import AwaiterResolve from "../../awaiter/resolve";
import AwaiterWait from "../../awaiter/wait";
export default class InMemoryAwaiter implements AwaiterWait, AwaiterResolve {
    private resolvers;
    wait(actorId: string, messageId: string, timeoutMillis: number): Promise<boolean>;
    resolve(actorId: string, messageId: string): Promise<void>;
    private finish;
}
