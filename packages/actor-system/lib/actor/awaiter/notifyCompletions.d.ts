import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
export default function notifyCompletions(env: ActorProperty & ActorLogger & {
    awaiter: AwaiterResolve;
}, metas: AwaiterMeta[]): Promise<void>;
