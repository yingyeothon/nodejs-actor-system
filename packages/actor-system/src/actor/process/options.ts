export interface IActorProcessOptions {
  /**
   * A flag that decides whether to process the actor's message queue only once or continue.
   * Combining `aliveMillis` can lead to complex situations, so please refer to` aliveMillis` comment.
   */
  oneShot?: boolean;

  /**
   * Continue processing messages in the actor's queue for the specified time.
   * However, if the actor is already owned by another thread, you can still try meaningless idling.
   * If `oneShot` is true, this operation will terminate as soon as it is finished, even if this time remains.
   *
   * The default value depends on the following situations:
   * 1. If both this value and `oneShot` are not set, `oneShot` is regarded as true and executed only once.
   * 2. If this value is set and `oneShot` is not set, `oneShot` is regarded as false and the actor will continue to be tried during that time.
   *
   * If this value is not set and `oneShot` is false, the processing function will not terminate.
   */
  aliveMillis?: number;

  /**
   * If an actor runs on a container that has a limitation of lifetime
   * such as AWS Lambda, it should shift to a new actor to process all messages
   * properly from the situation that kills a container by its hypervisor.
   *
   * An actor can have a limited lifetime via env parameter, and when it has
   * been reached it occurs `shift` event to its observers to give a shift chance.
   */
  shiftable?: boolean;
}
