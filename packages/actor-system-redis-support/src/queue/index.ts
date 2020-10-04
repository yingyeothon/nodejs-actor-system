import { Codec } from "@yingyeothon/codec";
import { LogWriter } from "@yingyeothon/logger";
import QueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import QueueLength from "@yingyeothon/actor-system/lib/queue/length";
import QueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import QueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import flush from "./flush";
import pop from "./pop";
import push from "./push";
import size from "./size";

interface RedisQueueArguments {
  connection: RedisConnection;
  keyPrefix?: string;
  codec?: Codec<string>;
  logger?: LogWriter;
}

export class RedisQueue
  implements
    QueueLength,
    QueueProducer,
    QueueSingleConsumer,
    QueueBulkConsumer {
  public readonly size: (actorId: string) => Promise<number>;
  public readonly push: <T>(actorId: string, item: T) => Promise<void>;
  public readonly pop: <T>(actorId: string) => Promise<T | null>;
  public readonly peek: <T>(actorId: string) => Promise<T | null>;
  public readonly flush: <T>(actorId: string) => Promise<T[]>;

  constructor(args: RedisQueueArguments) {
    const queue = {
      ...size(args),
      ...pop(args),
      ...push(args),
      ...flush(args),
    };
    for (const key of Object.keys(queue)) {
      this[key] = queue[key];
    }
  }
}
