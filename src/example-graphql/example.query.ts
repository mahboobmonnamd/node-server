import { withFilter } from 'graphql-subscriptions';
import gql from 'graphql-tag';
import { PubSubInstance } from '../graphql/pubsub';

// Hardcoded data store
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Schema definition
export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  extend type Query {
    books: [Book]
  }

  extend type Mutation {
    createPost(test: String): String
  }

  extend type Subscription {
    postCreated: String
  }
`;

// Resolver map
export const resolvers = {
  Query: {
    books() {
      return books;
    },
  },
  Mutation: {
    createPost: async (_parent, args, context) => {
      PubSubInstance.pubsub.publish('POST_CREATED', { test: 'test' });
      return 'test';
    },
  },
  Subscription: {
    postCreated: {
      subscribe: withFilter(
        () => PubSubInstance.pubsub.asyncIterator(['POST_CREATED']),
        (payload, variables, connection) => {
          //   based on condition it will return
          return true;
        },
      ),
    },
  },
};

export const onConnect = (connectionParams, webSocket) => {
  console.log(
    '🚀 ~ file: example.query.ts ~ line 64 ~ onConnect ~ connectionParams',
    connectionParams,
    webSocket,
  );
  console.log('connected');
};

export const onDisConnect = () => {
  console.log('disconnected');
};
