import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
export default function notifyCompletion(env: ActorProperty & ActorLogger & {
    awaiter: AwaiterResolve;
}, meta: AwaiterMeta): Promise<void>;
