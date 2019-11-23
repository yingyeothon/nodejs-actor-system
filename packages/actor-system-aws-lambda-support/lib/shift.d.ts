import { Lambda } from "aws-sdk";
interface IShiftToNextLambdaArguments {
    functionName: string;
    functionVersion?: string;
}
export declare const shiftToNextLambda: ({ functionName, functionVersion }: IShiftToNextLambdaArguments) => (actorName: string) => Promise<import("aws-sdk/lib/request").PromiseResult<Lambda.InvocationResponse, import("aws-sdk").AWSError>>;
export {};
