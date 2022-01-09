import { ApolloGraphqlServer } from '../graphql';
import { onConnect, onDisConnect, resolvers, typeDefs } from './example.query';

ApolloGraphqlServer.startApolloServer({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
  subscriptions: {
    onConnect: onConnect,
    onDisconnect: onDisConnect,
  },
  serverOpts: {
    port: 1000,
  },
});
