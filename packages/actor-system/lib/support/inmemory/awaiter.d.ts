import IAwaiterResolve from "../../awaiter/resolve";
import IAwaiterWait from "../../awaiter/wait";
export default class InMemoryAwaiter implements IAwaiterWait, IAwaiterResolve {
    private resolvers;
    wait(actorId: string, messageId: string, timeoutMillis: number): Promise<boolean>;
    resolve(actorId: string, messageId: string): Promise<void>;
    private finish;
}
