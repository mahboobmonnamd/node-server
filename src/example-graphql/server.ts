import { ApolloGraphqlServer } from '../graphql';
import { resolvers, typeDefs } from './example.query';

ApolloGraphqlServer.startApolloServer([typeDefs], [resolvers], null, null, { port: 1000 });
