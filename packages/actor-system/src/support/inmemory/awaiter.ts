import AwaiterResolve from "../../awaiter/resolve";
import AwaiterWait from "../../awaiter/wait";

type BooleanResolver = (result: boolean) => void;

export default class InMemoryAwaiter implements AwaiterWait, AwaiterResolve {
  private resolvers: { [id: string]: BooleanResolver } = {};

  public async wait(
    actorId: string,
    messageId: string,
    timeoutMillis: number
  ): Promise<boolean> {
    const id = actorId + messageId;
    return new Promise<boolean>((resolve) => {
      this.resolvers[id] = resolve;
      if (timeoutMillis > 0) {
        setTimeout(() => this.finish(id, false), timeoutMillis);
      }
    });
  }

  public async resolve(actorId: string, messageId: string): Promise<void> {
    this.finish(actorId + messageId, true);
  }

  private finish(id: string, result: boolean) {
    const resolver = this.resolvers[id];
    if (!resolver) {
      return;
    }
    resolver(result);
    delete this.resolvers[id];
  }
}
