import IAwaiterWait from "../../awaiter/wait";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
export default function awaitMessage(env: IActorProperty & IActorLogger & {
    awaiter: IAwaiterWait;
}, messageId: string, awaitTimeoutMillis: number): Promise<boolean>;
