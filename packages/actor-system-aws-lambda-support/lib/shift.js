"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
exports.shiftToNextLambda = ({ functionName, functionVersion }) => (actorName) => new aws_sdk_1.Lambda()
    .invoke({
    FunctionName: functionName,
    InvocationType: "Event",
    Qualifier: functionVersion || "$LATEST",
    Payload: JSON.stringify({
        actorName
    })
})
    .promise();
//# sourceMappingURL=shift.js.map