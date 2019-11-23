import { IAwaiter } from "../../awaiter";
export declare class InMemoryAwaiter implements IAwaiter {
    private resolvers;
    wait(actorId: string, messageId: string, timeoutMillis: number): Promise<boolean>;
    resolve(actorId: string, messageId: string): Promise<void>;
    private finish;
}
