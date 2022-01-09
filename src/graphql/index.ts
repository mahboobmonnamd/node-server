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
        ApolloServerPluginLandingPageGraphQLPlayground({ endpoint: '/playground' }),
        ApolloServerPluginLandingPageDisabled(),
      ],
    ];
  }

  static async startApolloServer(
    typeDefs,
    resolvers,
    dataSources,
    context,
    { port, isDev = false },
  ) {
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({ typeDefs: [coreSchema, ...typeDefs], resolvers });

    const subscriptionServer = SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onConnect() {
          //   make it as function
          return '';
        },
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

    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  }
}
