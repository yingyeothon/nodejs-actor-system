import UserMessageItem from "./userMessageItem";
import UserMessageMeta from "./userMessageMeta";
export default interface UserMessage<T> extends UserMessageItem<T>, UserMessageMeta {
}
