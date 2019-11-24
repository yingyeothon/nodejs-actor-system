import { IActorLambdaEvent } from "./event";
export declare const sendMessage: import("aws-lambda").Handler<import("aws-lambda").APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult>;
export declare const bottomHalf: import("aws-lambda").Handler<IActorLambdaEvent, void>;
