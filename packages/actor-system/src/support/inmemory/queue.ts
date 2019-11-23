import { IQueue } from "../../queue";

export class InMemoryQueue implements IQueue {
  private readonly queues: {
    [actorId: string]: any[];
  } = {};

  public async size(actorId: string) {
    return this.queues[actorId] ? this.queues[actorId].length : 0;
  }

  public async push<T>(actorId: string, item: T) {
    if (!this.queues[actorId]) {
      this.queues[actorId] = [];
    }
    this.queues[actorId].push(item);
  }

  public async pop<T>(actorId: string): Promise<T | null> {
    if (!this.queues[actorId] || this.queues[actorId].length === 0) {
      return null;
    }
    return this.queues[actorId].shift();
  }

  public async peek<T>(actorId: string): Promise<T | null> {
    if (!this.queues[actorId] || this.queues[actorId].length === 0) {
      return null;
    }
    return this.queues[actorId][0];
  }

  public async flush<T>(actorId: string): Promise<T[]> {
    if (!this.queues[actorId] || this.queues[actorId].length === 0) {
      return [];
    }
    const elements = [...this.queues[actorId]];
    delete this.queues[actorId];
    return elements;
  }
}
