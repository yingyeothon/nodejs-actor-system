"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newEnv = (subsys) => (either) => (Object.assign({}, subsys, (typeof either === "function" ? either() : either), { _consume: "single" }));
exports.newBulkEnv = (subsys) => (either) => (Object.assign({}, subsys, (typeof either === "function" ? either() : either), { _consume: "bulk" }));
//# sourceMappingURL=env.js.map