import IUserMessageItem from "./userMessageItem";
import IUserMessageMeta from "./userMessageMeta";

export default interface IUserMessage<T>
  extends IUserMessageItem<T>,
    IUserMessageMeta {}
