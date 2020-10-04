import QueueBulkConsumer from "../../queue/bulkConsumer";
import QueueLength from "../../queue/length";
import QueueProducer from "../../queue/producer";
import QueueSingleConsumer from "../../queue/singleConsumer";

export default class InMemoryQueue
  implements
    QueueLength,
    QueueProducer,
    QueueSingleConsumer,
    QueueBulkConsumer {
  private readonly queues: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [actorId: string]: any[];
  } = {};

  public size = async (actorId: string): Promise<number> => {
    return this.queues[actorId] ? this.queues[actorId].length : 0;
  };

  public push = async <T>(actorId: string, item: T): Promise<void> => {
    if (!this.queues[actorId]) {
      this.queues[actorId] = [];
    }
    this.queues[actorId].push(item);
  };

  public pop = async <T>(actorId: string): Promise<T | null> => {
    if (!this.queues[actorId] || this.queues[actorId].length === 0) {
      return null;
    }
    return this.queues[actorId].shift();
  };

  public peek = async <T>(actorId: string): Promise<T | null> => {
    if (!this.queues[actorId] || this.queues[actorId].length === 0) {
      return null;
    }
    return this.queues[actorId][0];
  };

  public flush = async <T>(actorId: string): Promise<T[]> => {
    if (!this.queues[actorId] || this.queues[actorId].length === 0) {
      return [];
    }
    const elements = [...this.queues[actorId]];
    delete this.queues[actorId];
    return elements;
  };
}
