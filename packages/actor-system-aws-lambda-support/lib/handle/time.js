"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalTimeline = exports.Timeline = void 0;
class Timeline {
    constructor() {
        this.epochMillis = Date.now();
        this.timeoutMillis = 5 * 1000;
    }
    reset(timeoutMillis) {
        this.epochMillis = Date.now();
        if (timeoutMillis !== undefined) {
            this.timeoutMillis = timeoutMillis;
        }
    }
    get passedMillis() {
        return Date.now() - this.epochMillis;
    }
    get remainMillis() {
        return this.epochMillis + this.timeoutMillis - Date.now();
    }
    get over() {
        return this.remainMillis <= 0;
    }
}
exports.Timeline = Timeline;
exports.globalTimeline = new Timeline();
//# sourceMappingURL=time.js.map