import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';
import Redis from 'ioredis';

enum PubSubType {
  'local',
  'redis',
}
export interface IPubSub {
  type: PubSubType;
  redis?: {
    url: string;
  };
}
export class PubSubInstance {
  private constructor() {}

  private static pubSubInstance: PubSub | RedisPubSub;

  static get pubsub() {
    return PubSubInstance.pubSubInstance;
  }

  static setPubsub(params: IPubSub) {
    switch (params.type) {
      case PubSubType.local:
        PubSubInstance.pubSubInstance = new PubSub();
        break;
      case PubSubType.redis:
        PubSubInstance.pubSubInstance = new RedisPubSub({
          publisher: new Redis(params.redis.url),
          subscriber: new Redis(params.redis.url),
        });
        break;
      default:
        PubSubInstance.pubSubInstance = new PubSub();
        break;
    }
  }
}
