import IQueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import IQueueLength from "@yingyeothon/actor-system/lib/queue/length";
import IQueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import IQueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { ICodec } from "@yingyeothon/codec";
import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import flush from "./flush";
import pop from "./pop";
import push from "./push";
import size from "./size";

interface IRedisQueueArguments {
  connection: IRedisConnection;
  keyPrefix?: string;
  codec?: ICodec<string>;
  logger?: ILogger;
}

export class RedisQueue
  implements
    IQueueLength,
    IQueueProducer,
    IQueueSingleConsumer,
    IQueueBulkConsumer {
  public readonly size: (actorId: string) => Promise<number>;
  public readonly push: <T>(actorId: string, item: T) => Promise<void>;
  public readonly pop: <T>(actorId: string) => Promise<T | null>;
  public readonly peek: <T>(actorId: string) => Promise<T | null>;
  public readonly flush: <T>(actorId: string) => Promise<T[]>;

  constructor(args: IRedisQueueArguments) {
    const queue = {
      ...size(args),
      ...pop(args),
      ...push(args),
      ...flush(args)
    };
    for (const key of Object.keys(queue)) {
      this[key] = queue[key];
    }
  }
}
