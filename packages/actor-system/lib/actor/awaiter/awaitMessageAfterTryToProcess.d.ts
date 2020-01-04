import IAwaiterWait from "../../awaiter/wait";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IAwaiterMeta from "../message/awaiterMeta";
export default function awaitMessageAfterTryToProcess(env: IActorProperty & IActorLogger & {
    awaiter: IAwaiterWait;
}, currentMeta: IAwaiterMeta, tryToProcess: () => Promise<IAwaiterMeta[]>): Promise<boolean>;
