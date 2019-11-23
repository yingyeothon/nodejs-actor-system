export interface IActorProcessOptions {
  /**
   * If an actor runs on a container that has a limitation of lifetime
   * such as AWS Lambda, it should shift to a new actor to process all messages
   * properly from the situation that kills a container by its hypervisor.
   *
   * An actor can have a limited lifetime via env parameter, and when it has
   * been reached it occurs `shift` event to its observers to give a shift chance.
   */
  shiftTimeout?: number;
}
