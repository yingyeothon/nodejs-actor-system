export declare class Timeline {
    epochMillis: number;
    timeoutMillis: number;
    reset(timeoutMillis?: number): void;
    readonly passedMillis: number;
    readonly remainMillis: number;
    readonly over: boolean;
}
export declare const globalTimeline: Timeline;
