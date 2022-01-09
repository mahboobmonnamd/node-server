import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import coreSchema from './core.schema';
import { IPubSub, PubSubInstance } from './pubsub';

export interface GraphServerOptions {
  typeDefs: any[];
  resolvers: any[];
  dataSources?: any;
  context?: any[];
  pubSubConfig?: IPubSub;
  subscriptions?: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onConnect?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onDisconnect?: Function;
  };
  serverOpts: {
    port: number;
  };
}
export class ApolloGraphqlServer {
  private constructor() {}

  private static plugins(plug: any[]): any[] {
    return [
      [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                plug[0].close();
              },
            };
          },
        },
        ApolloServerPluginDrainHttpServer({ httpServer: plug[1] }),
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground({ endpoint: '/playground' }),
      ],
    ];
  }

  static async startApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context,
    pubSubConfig = { type: 0 },
    subscriptions = {},
    serverOpts,
  }: GraphServerOptions) {
    const { port } = serverOpts;
    const { onConnect = null, onDisconnect = null } = subscriptions;
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({ typeDefs: [coreSchema, ...typeDefs], resolvers });

    const subscriptionServer = SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        ...(onConnect && { onConnect }),
        ...(onDisconnect && { onDisconnect }),
      },
      {
        server: httpServer,
        path: '/graphql',
      },
    );

    const server = new ApolloServer({
      schema,
      plugins: ApolloGraphqlServer.plugins([subscriptionServer, httpServer]),
      ...(context && { context }),
      ...(dataSources && { dataSources }),
    });
    PubSubInstance.setPubsub(pubSubConfig);
    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  }
}
