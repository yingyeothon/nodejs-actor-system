import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterWait from "../../awaiter/wait";
export default function awaitMessage(env: ActorProperty & ActorLogger & {
    awaiter: AwaiterWait;
}, messageId: string, awaitTimeoutMillis: number): Promise<boolean>;
