export declare class Timeline {
    epochMillis: number;
    timeoutMillis: number;
    reset(timeoutMillis?: number): void;
    get passedMillis(): number;
    get remainMillis(): number;
    get over(): boolean;
}
export declare const globalTimeline: Timeline;
