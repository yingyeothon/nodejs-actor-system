import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterWait from "../../awaiter/wait";
export default function awaitMessageAfterTryToProcess(env: ActorProperty & ActorLogger & {
    awaiter: AwaiterWait;
}, currentMeta: AwaiterMeta, tryToProcess: () => Promise<AwaiterMeta[]>): Promise<boolean>;
