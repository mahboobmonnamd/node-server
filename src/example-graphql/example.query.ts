import gql from 'graphql-tag';

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
`;

// Resolver map
export const resolvers = {
  Query: {
    books() {
      return books;
    },
  },
};
