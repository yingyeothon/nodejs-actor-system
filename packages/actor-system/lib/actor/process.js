"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const loop_1 = require("./process/loop");
const utils_1 = require("./process/utils");
function tryToProcess(env, { oneShot, aliveMillis, shiftable } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { logger = logger_1.nullLogger, id, shift } = env;
        const maybeOneShot = oneShot === undefined && aliveMillis === undefined;
        const startMillis = Date.now();
        const isAlive = () => aliveMillis && aliveMillis > 0
            ? Date.now() - startMillis < aliveMillis
            : true;
        const metas = [];
        while (isAlive()) {
            const localMetas = yield loop_1.default(env, isAlive);
            Array.prototype.push.apply(metas, localMetas);
            if (!isAlive() && shiftable) {
                logger.debug(`actor`, `shift-timeout`, id);
                if (shift) {
                    yield utils_1.maybeAwait(shift(id));
                }
                break;
            }
            if (oneShot || maybeOneShot) {
                break;
            }
        }
        return metas;
    });
}
exports.default = tryToProcess;
//# sourceMappingURL=process.js.map