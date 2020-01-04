import IQueueBulkConsumer from "../../queue/bulkConsumer";
import IQueueLength from "../../queue/length";
import IQueueProducer from "../../queue/producer";
import IQueueSingleConsumer from "../../queue/singleConsumer";

export default class InMemoryQueue
  implements
    IQueueLength,
    IQueueProducer,
    IQueueSingleConsumer,
    IQueueBulkConsumer {
  private readonly queues: {
    [actorId: string]: any[];
  } = {};

  public size = async (actorId: string) => {
    return this.queues[actorId] ? this.queues[actorId].length : 0;
  };

  public push = async <T>(actorId: string, item: T) => {
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
