export interface IQueue {
    size(actorId: string): Promise<number>;
    push<T>(actorId: string, item: T): Promise<void>;
    pop<T>(actorId: string): Promise<T | null>;
    peek<T>(actorId: string): Promise<T | null>;
    flush<T>(actorId: string): Promise<T[]>;
}
