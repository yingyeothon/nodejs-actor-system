import IAwaiterResolve from "../../awaiter/resolve";
import IActorLogger from "../env/logger";
import IActorProperty from "../env/property";
import IAwaiterMeta from "../message/awaiterMeta";
export default function notifyCompletion(env: IActorProperty & IActorLogger & {
    awaiter: IAwaiterResolve;
}, meta: IAwaiterMeta): Promise<void>;
